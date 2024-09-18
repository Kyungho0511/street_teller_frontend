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
import { pathToSection } from "../utils/utils";
import { Color, mapSections } from "../constants/mapConstants";
import {
  geoJsonfilePath,
  HealthcareFeatureCollection,
  HealthcarePropertyName,
} from "../constants/geoJsonConstants";
import { Cluster, ClusterList } from "../constants/surveyConstants";
import * as mapbox from "../services/mapbox";
import Button from "../components/atoms/Button";
import { OpenAiResponseJSON, streamOpenAI } from "../services/openai";

/**
 * Cluster page component which consists of three clustering sub-sections.
 */
export default function ClusterPage() {
  const { survey, setSurveyContext } = useContext(SurveyContext);
  const { map } = useContext(MapContext);

  const { clusterId } = useParams<string>()!;
  const clusterIndex = parseInt(clusterId!) - 1;
  const location = useLocation();
  const clusterName = pathToSection(location.pathname)
  const clusterList = survey.clusterLists[clusterIndex];
  
  const [kMeansLayer, setKMeansLayer] = useState<kmeans.KMeansLayer>();
  const [loading, setLoading] = useState<boolean>(true); // loading status for the fetch request
  const [geoJson, setGeoJson] = useState<HealthcareFeatureCollection>({
    type: "FeatureCollection",
    features: [],
  });

  // Fetch GeoJson.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(geoJsonfilePath);
        if (!response.ok) {
          throw new Error("Network error: " + response.statusText);
        }
        const data = await response.json();
        setGeoJson(data);
        setLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  // Set KMeansLayer on loading a new clustering page.
  useEffect(() => {
    if (geoJson.features.length === 0) return;

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
    const data: number[][] = kmeans.processData(geoJson, selectedAttributes);
    const kMeansResult: KMeansResult = kmeans.runKMeans(data);
    const color: Color = mapSections.find((sec) => sec.id === clusterName)!.color!;
    setKMeansLayer(kmeans.setLayer(kMeansResult, geoJson, clusterName, color.categorized, selectedAttributes));
  }, [clusterId, survey.preferenceList.list, geoJson, location.pathname, clusterName]);


  // Fetch and display OpenAI reasoning on setting kMeansLayer.
  useEffect(() => {
    if (!kMeansLayer) return;
    startOpenAIReport();
  }, [kMeansLayer])


  // Add KMeansLayer to the map.
  useEffect(() => {
    if (!kMeansLayer || !map) return;
    mapbox.addClusterLayer(kMeansLayer, map);

    // Remove KMeansLayer from mapbox when on unmount.
    return () => mapbox.removeClusterLayer(kMeansLayer, map)
  }, [kMeansLayer, map]);


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
          centroids: kMeansLayer?.attributes.map((attr, j) => ({
            name: attr,
            value: kMeansLayer?.centroids[i][j],
          })),
        } as Cluster)
    );
    try {
      // Start OpenAI JSON response streaming.
      for await (const chunk of streamOpenAI({ type:"cluster", content: promptJson })) {
        const response = chunk as OpenAiResponseJSON;

      // Update the survey context with parsed data.
      // Performance optimization needed here!!!!!!!
      // Performance optimization needed here!!!!!!!
        const newList = [...clusterList.list];
        response?.clusters?.forEach((cluster, i) => {
          newList[i] = {
            ...newList[i],
            name: cluster?.name,
            reasoning: cluster?.reasoning,
            centroids: kMeansLayer!.attributes.map((attr, j) => ({
              name: attr,
              value: kMeansLayer!.centroids[i][j],
            })),
            color: kMeansLayer!.colors[i],
          };
        });
        setSurveyContext({name: clusterName, list: newList} as ClusterList);
      }
    } catch (error) {
      console.error("Failed to fetch openAI response:", error);
    }
  }

  return (
    <>
      <SidebarSection title={"Select Target Clusters"}>
        <p>
          Review the site analysis of clusters. If you want me to retry
          clustering reasoning, press the "retry analysis" button below. When
          you are ready, exclude the clusters you're not targeting, and
          continue.
        </p>
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

      <LegendSection title={`${clusterName} analysis`}>
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
