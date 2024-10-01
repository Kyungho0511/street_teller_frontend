import { useContext, useEffect, useState } from "react";
import CheckboxListAI from "../components/molecules/CheckboxListAI";
import DropdownManager from "../components/molecules/DropdownManager";
import LegendSection from "../components/organisms/LegendSection";
import SidebarSection from "../components/organisms/SidebarSection";
import { SurveyContext } from "../context/SurveyContext";
import { useLocation, useParams } from "react-router-dom";
import { CLUSTERING_SIZE } from "../services/kmeans";
import * as kmeans from "../services/kmeans";
import { KMeansResult } from "ml-kmeans/lib/KMeansResult";
import { MapContext } from "../context/MapContext";
import { getSeriesNumber, pathToSection } from "../utils/utils";
import { Color, mapSections } from "../constants/mapConstants";
import { geoJsonFilePath, HealthcarePropertyName } from "../constants/geoJsonConstants";
import * as mapbox from "../services/mapbox";
import { MessageContext } from "../context/MessageContext";
import useGeoJson from "../hooks/useGeoJson";
import useEffectAfterMount from "../hooks/useEffectAfterMount";
import useOpenaiInstruction from "../hooks/useOpenaiInstruction";

/**
 * Cluster page component which consists of three clustering sub-sections.
 */
export default function ClusterPage() {

  // Global states
  const { survey } = useContext(SurveyContext);
  const { addMessage, updatePrompt, loadingMessage } = useContext(MessageContext);
  const { map } = useContext(MapContext);

  // Local states
  const { clusterId } = useParams<string>()!;
  const clusterIndex = parseInt(clusterId!) - 1;
  const location = useLocation();
  const clusterName = pathToSection(location.pathname)
  const clusterList = survey.clusterLists[clusterIndex];
  const [kMeansLayers, setKMeansLayers] = useState<kmeans.KMeansLayer[]>([]);
  const [loadingGeoJson, errorGeoJson, geoJson, setGeoJson] = useGeoJson(geoJsonFilePath);

  // Get openAI instructions on the current page.
  useOpenaiInstruction(addMessage, updatePrompt, parseInt(clusterId!), [
    `${survey.preferenceList.list[clusterIndex * CLUSTERING_SIZE].category}`,
    `${survey.preferenceList.list[clusterIndex * CLUSTERING_SIZE + 1].category}`,
  ]);

  // Filter the geoJson data based on the selected clusters from the previous cluster page.
  useEffect(() => {
    if (clusterIndex > 0 && kMeansLayers[clusterIndex - 1]) {
      const selection: boolean[] = survey.clusterLists[
        clusterIndex - 1
      ].list.map((cluster) => cluster.checked);
      const filteredGeoJson = kmeans.getFilteredGeoJson(
        selection,
        kMeansLayers[clusterIndex - 1].geoJson
      );
      setGeoJson(filteredGeoJson);
    }
  }, [location.pathname]);


  // Set KMeansLayer on loading a new clustering page.
  useEffectAfterMount(() => {
    // Get attributes selected by users.
    const startIndex = CLUSTERING_SIZE * (parseInt(clusterId!) - 1);
    const endIndex = CLUSTERING_SIZE * parseInt(clusterId!);
    const selectedAttributes: HealthcarePropertyName[] = [];

    for (let i = startIndex, n = endIndex; i < n; i++) {
      if (survey.preferenceList.list.length - 1 < i) break;
      survey.preferenceList.list[i].subCategories.forEach((subCategory) => {
        selectedAttributes.push(subCategory.name);
      });
    }

    // Set KMeansLayer based on the selected attributes.
    const data: number[][] = kmeans.processData(geoJson!, selectedAttributes);
    const kMeansResult: KMeansResult = kmeans.runKMeans(data);
    const color: Color = mapSections.find((sec) => sec.id === clusterName)!.color!;
    setKMeansLayers((prev) => {
      const kMeansLayer = kmeans.setLayer(
        kMeansResult,
        geoJson!,
        clusterName,
        color.categorized,
        selectedAttributes
      );
      const kMeansLayers = [...prev];
      kMeansLayers[clusterIndex] = kMeansLayer;
      return kMeansLayers;
    });
  }, [survey.preferenceList.list, geoJson]);


  // Add KMeansLayer to the map.
  useEffectAfterMount(() => {
    if (!map || !kMeansLayers[clusterIndex]) return;
    mapbox.addClusterLayer(kMeansLayers[clusterIndex], map!);

    // Remove KMeansLayer from mapbox when on unmount.
    return () => mapbox.removeClusterLayer(kMeansLayers[clusterIndex], map!)
  }, [kMeansLayers, map]);


  // Update mapping on selected clusterList change
  useEffect(() => {
    mapbox.updateClusterLayer(clusterList, map);
  }, [clusterList, map]);


  // Display loading & error status of fetching geoJson data.
  if (loadingGeoJson) {
    return <SidebarSection><p>Loading GeoJson Data...</p></SidebarSection>
  }
  if (errorGeoJson) {
    return <SidebarSection><p>{errorGeoJson}</p></SidebarSection>
  }

  return (
    <>
      <SidebarSection title={"select target clusters"}>
        <CheckboxListAI
          name={clusterName}
          list={clusterList.list}
          index={clusterIndex}
          kMeansLayers={kMeansLayers}
        />
      </SidebarSection>

      <LegendSection
        title={`Clustering Step`}
        steps={getSeriesNumber(survey.clusterLists.length)}
        currentStep={parseInt(clusterId!)}
      >
        <DropdownManager
          lists={clusterList.list}
          displayChart
          displayColorbox
          expandFirstList={!loadingMessage.json}
          autoCollapse
        />
      </LegendSection>
    </>
  );
}