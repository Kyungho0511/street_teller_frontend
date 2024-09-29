import { useContext, useEffect, useState } from "react";
import CheckboxList from "../components/molecules/CheckboxList";
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
import { Cluster, ClusterList, SiteCategory } from "../constants/surveyConstants";
import * as mapbox from "../services/mapbox";
import Button from "../components/atoms/Button";
import { getInstructionPrompt, OpenAiResponseJSON, streamOpenAI } from "../services/openai";
import { MessageContext } from "../context/MessageContext";
import { Prompt } from "../constants/messageConstants";
import useGeoJson from "../hooks/useGeoJson";
import useEffectAfterMount from "../hooks/useEffectAfterMount";

/**
 * Cluster page component which consists of three clustering sub-sections.
 */
export default function ClusterPage() {

  // Global states
  const { survey, setSurveyContext } = useContext(SurveyContext);
  const { messages, addMessage, updatePrompt } = useContext(MessageContext);
  const { map } = useContext(MapContext);

  // Local states
  const { clusterId } = useParams<string>()!;
  const clusterIndex = parseInt(clusterId!) - 1;
  const location = useLocation();
  const clusterName = pathToSection(location.pathname)
  const clusterList = survey.clusterLists[clusterIndex];
  const [kMeansLayers, setKMeansLayers] = useState<kmeans.KMeansLayer[]>([]);
  const [loading, error, geoJson, setGeoJson] = useGeoJson(geoJsonFilePath);


  // Get openAI instructions on the current page.
  useEffect(() => {
    addMessage({ user: "", ai: "", type: "section" });
    const selectedCategories: SiteCategory[] = [
      `${survey.preferenceList.list[clusterIndex * CLUSTERING_SIZE].category}`,
      `${survey.preferenceList.list[clusterIndex * CLUSTERING_SIZE + 1].category}`,
    ];
    const prompt: Prompt = {
      type: "section",
      content: getInstructionPrompt(clusterName, parseInt(clusterId!), selectedCategories),
    };
    updatePrompt(prompt);
  }, [location.pathname]);


  // Filter the geoJson data based on the selected clusters from the previous cluster page.
  useEffect(() => {
    if (clusterIndex > 0 && kMeansLayers[clusterIndex - 1]) {
      const selection: boolean[] = survey.clusterLists[
        clusterIndex - 1
      ].list.map((cluster) => cluster.checked);
      const filteredGeoJson = kmeans.getFilteredGeoJson(selection, kMeansLayers[clusterIndex - 1].geoJson);
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


  // Fetch and display OpenAI reasoning on setting kMeansLayer.
  useEffectAfterMount(() => {
    startOpenAIReport();
  }, [kMeansLayers])


  // Add KMeansLayer to the map.
  useEffectAfterMount(() => {
    mapbox.addClusterLayer(kMeansLayers[clusterIndex], map!);

    // Remove KMeansLayer from mapbox when on unmount.
    return () => mapbox.removeClusterLayer(kMeansLayers[clusterIndex], map!)
  }, [kMeansLayers, map]);


  // Update mapping on selected clusterList change
  useEffect(() => {
    mapbox.updateClusterLayer(clusterList, map);
  }, [clusterList, map]);


  const startOpenAIReport = async () => {
    // Construct prompt JSON for OpenAI.
    const promptJson: Cluster[] = clusterList.list.map(
      (_, i) =>
        ({
          name: "",
          centroids: kMeansLayers[clusterIndex]?.attributes.map((attr, j) => ({
            name: attr,
            value: kMeansLayers[clusterIndex]?.centroids[i][j],
          })),
        } as Cluster)
    );
    try {
      // Start OpenAI JSON response streaming.
      let response: OpenAiResponseJSON = {clusters:[{name:"",reasoning:""}]};
      for await (const chunk of streamOpenAI(
        { type: "cluster", content: promptJson },
        messages,
        survey.preferenceList.list,
        clusterIndex
      )) {
        response = chunk as OpenAiResponseJSON;

        // Update the survey context with parsed data.
        // Performance optimization needed here!!!!!!!
        // Performance optimization needed here!!!!!!!
        const newList = [...clusterList.list];
        response?.clusters?.forEach((cluster, i) => {
          newList[i] = {
            ...newList[i],
            name: cluster?.name,
            reasoning: cluster?.reasoning,
            centroids: kMeansLayers[clusterIndex]!.attributes.map(
              (attr, j) => ({
                name: attr,
                value: kMeansLayers[clusterIndex]!.centroids[i][j],
              })
            ),
            color: kMeansLayers[clusterIndex]!.colors[i],
          };
        });
        setSurveyContext({ name: clusterName, list: newList } as ClusterList);
      }

      // Update the message context when the response is fully fetched.
      addMessage({
        user: JSON.stringify(promptJson),
        ai: JSON.stringify(response),
        type: "cluster",
      });

    } catch (error) {
      console.error("Failed to fetch openAI response:", error);
    }
  }

  // Display data loading or error status
  if (loading) {
    return <SidebarSection><p>Loading GeoJson Data...</p></SidebarSection>
  }
  if (error) {
    return <SidebarSection><p>{error}</p></SidebarSection>
  }

  return (
    <>
      <SidebarSection
        title={"select target clusters"}
      >
        <CheckboxList
          name={clusterName}
          list={clusterList.list}
          colorbox
          setSurveyContext={setSurveyContext}
        />
        <Button
          text={"retry analysis"}
          color={"grey"}
          location={"sidebar"}
          handleClick={startOpenAIReport}
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
          expandFirstList
          autoCollapse
        />
      </LegendSection>
    </>
  );
}
