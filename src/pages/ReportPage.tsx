import { useContext, useEffect, useState } from "react";
import LegendSection from "../components/organisms/LegendSection";
import Sidebar from "../components/organisms/Sidebar";
import SidebarSection from "../components/organisms/SidebarSection";
import { SurveyContext } from "../context/SurveyContext";
import { MapContext } from "../context/MapContext";
import useOpenaiInstruction from "../hooks/useOpenaiInstruction";
import { blendColors, crossReferenceList } from "../utils/utils";
import {
  NUMBER_OF_CLUSTERING_STEPS,
  Report,
} from "../constants/surveyConstants";
import {
  HealthcareFeatureCollection,
  HealthcarePropertyName,
} from "../constants/geoJsonConstants";
import { getFilteredGeoJson } from "../services/kmeans";
import { addReportLayer } from "../services/mapbox";
import { defaultColor } from "../constants/mapConstants";
import { runOpenAI } from "../services/openai";
import { ReportPrompt } from "../constants/messageConstants";

/**
 * Report page component where users select sites to report.
 */
export default function ReportPage() {
  const { survey } = useContext(SurveyContext);
  const { mapViewer } = useContext(MapContext);
  const [geoJson, setGeoJson] = useState<HealthcareFeatureCollection>();
  const reportName = "report";

  // GeoJson data from the last KMeansLayer of the cluster page.
  // const prevGeoJson = kMeansLayers[kMeansLayers.length - 1];

  useOpenaiInstruction();

  // Prepare geoJson data for the report page.
  useEffect(() => {
    if (!prevGeoJson) return;

    const lastClusterIndex = NUMBER_OF_CLUSTERING_STEPS - 1;
    const selection = survey[`cluster${lastClusterIndex}`].list.map(
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

    // Get unique reports from user selected clusters.
    const clusters = [survey.cluster1, survey.cluster2, survey.cluster3];
    const selectedClusterLists = clusters.map((cluster) =>
      cluster.list.filter((item) => item.checked)
    );
    const crossReference = crossReferenceList(selectedClusterLists);

    // Count the number of geoId for each report.
    const reports: Report[] = crossReference.map((list, index) => ({
      name: "",
      reasoning: "",
      clusters: list,
      color: defaultColor,
      geoIds: [],
      index,
    }));
    const features = geoJson.features;
    features.forEach((feature, index) => {
      const report = reports.find((report) =>
        report.clusters.every((cluster) => {
          const key = ("cluster" + cluster.clusterId) as HealthcarePropertyName;
          return feature.properties[key] === cluster.index;
        })
      );
      if (report) {
        report.geoIds.push(feature.properties.GEOID as string);

        // Assign the unique report index to each tract.
        geoJson.features[index].properties.report = report.index;
      }
    });

    // Assign color to each report.
    reports.forEach((report) => {
      const colors = report.clusters.map((cluster) => cluster.color);
      const color = blendColors(colors);
      report.color = color;
    });

    // Construct prompts for OpenAI.
    const prompts: ReportPrompt[] = reports.map((report) => ({
      type: "report",
      content: report.clusters.map((cluster) => ({
        name: cluster.name,
        centroids: cluster.centroids,
        reasoning: cluster.reasoning,
      })),
    }));

    // Get OpenAI response.
    prompts.forEach((prompt) => {
      runOpenAI(prompt).then((response) => {
        console.log(response);
      });
    });

    // Add the geoJson data to the map.
    if (!mapViewer) return;
    addReportLayer(reportName, geoJson, reports, mapViewer);

    return () => {
      mapViewer.removeLayer(reportName);
      mapViewer.removeSource(reportName);
    };
  }, [geoJson, mapViewer]);

  return (
    <>
      <Sidebar>
        <SidebarSection>
          <p>sidebar section</p>
        </SidebarSection>
      </Sidebar>

      <LegendSection title={"Title"}>
        <p>legend section</p>
      </LegendSection>
    </>
  );
}
