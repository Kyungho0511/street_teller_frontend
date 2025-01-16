import { useContext, useEffect, useState } from "react";
import CheckboxList from "../components/molecules/CheckboxList";
import DropdownManager from "../components/molecules/DropdownManager";
import LegendSection from "../components/organisms/LegendSection";
import Sidebar from "../components/organisms/Sidebar";
import SidebarSection from "../components/organisms/SidebarSection";
import { SurveyContext } from "../context/SurveyContext";
import { KMeansContext } from "../context/KMeansContext";
import { MapContext } from "../context/MapContext";
import useOpenaiInstruction from "../hooks/useOpenaiInstruction";
import { crossReferenceList } from "../utils/utils";
import { ClusterCombination } from "../constants/surveyConstants";
import {
  HealthcareFeatureCollection,
  HealthcarePropertyName,
} from "../constants/geoJsonConstants";
import { getFilteredGeoJson } from "../services/kmeans";
import { addReportLayer } from "../services/mapbox";
import { map } from "framer-motion/client";

/**
 * Report page component where users select sites to report.
 */
export default function ReportPage() {
  const { survey } = useContext(SurveyContext);
  const { mapViewer } = useContext(MapContext);
  const { kMeansLayers } = useContext(KMeansContext);
  const [geoJson, setGeoJson] = useState<HealthcareFeatureCollection>();

  // GeoJson data from the last KMeansLayer of the cluster page.
  const prevGeoJson = kMeansLayers[kMeansLayers.length - 1];

  // Temporary cluster list for testing.
  const clusterList = survey.clusterLists[2];

  useOpenaiInstruction();

  // Prepare geoJson data for the report page.
  useEffect(() => {
    if (!prevGeoJson) return;

    const lastClusterIndex = survey.clusterLists.length - 1;
    const selection = survey.clusterLists[lastClusterIndex].list.map(
      (item) => item.checked
    );
    const geoJson = getFilteredGeoJson(
      `${lastClusterIndex + 1}`,
      selection,
      prevGeoJson.geoJson
    );
    setGeoJson(geoJson);
  }, [prevGeoJson]);

  useEffect(() => {
    if (!geoJson) return;

    // Get unique combinations from user selected clusters.
    const selectedClusterLists = survey.clusterLists.map((cluster) =>
      cluster.list.filter((item) => item.checked)
    );
    const crossReference = crossReferenceList(selectedClusterLists);

    // Count the number of geoId for each cluster combination.
    const clusterCombinations: ClusterCombination[] = crossReference.map(
      (list, index) => ({ clusters: list, geoIds: [], index })
    );
    const features = geoJson.features;
    features.forEach((feature, index) => {
      const combination = clusterCombinations.find((combination) =>
        combination.clusters.every((cluster) => {
          const key = ("cluster" + cluster.clusterId) as HealthcarePropertyName;
          return feature.properties[key] === cluster.index;
        })
      );
      if (combination) {
        combination.geoIds.push(feature.properties.GEOID as string);

        // Assign the unique combination index to each tract.
        geoJson.features[index].properties.clusterCombination =
          combination.index;
      }
    });

    // Add the geoJson data to the map.
    if (!mapViewer) return;
    addReportLayer("report", geoJson, mapViewer);

    return () => {
      mapViewer.removeLayer("report");
      mapViewer.removeSource("report");
    };
  }, [geoJson, mapViewer]);

  return (
    <>
      <Sidebar>
        <SidebarSection>
          <CheckboxList name={"Title"} list={clusterList.list} />
        </SidebarSection>
      </Sidebar>

      <LegendSection title={"Title"}>
        <DropdownManager
          lists={clusterList.list}
          displayChart
          displayColorbox
          autoCollapse
        />
      </LegendSection>
    </>
  );
}
