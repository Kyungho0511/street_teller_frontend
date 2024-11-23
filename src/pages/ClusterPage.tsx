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
import {
  geoJsonFilePath,
  HealthcarePropertyName,
} from "../constants/geoJsonConstants";
import * as mapbox from "../services/mapbox";
import { MessageContext } from "../context/MessageContext";
import useGeoJson from "../hooks/useGeoJson";
import useEffectAfterMount from "../hooks/useEffectAfterMount";
import PopupSection from "../components/organisms/PopupSection";
import PopupTextCluster from "../components/atoms/PopupTextCluster";
import { PopupContextProvider } from "../context/PopupContext";
import Sidebar from "../components/organisms/Sidebar";
import useOpenai from "../hooks/useOpenai";
import { Section } from "../constants/surveyConstants";

/**
 * Cluster page component which consists of three clustering sub-sections.
 */
export default function ClusterPage() {
  // Global states
  const { survey } = useContext(SurveyContext);
  const { addMessage, updatePrompt } = useContext(MessageContext);
  const { mapViewer, mapMode } = useContext(MapContext);

  // Local states
  const { clusterId } = useParams<string>()!;
  const clusterIndex = parseInt(clusterId!) - 1;
  const location = useLocation();
  const clusterName = pathToSection(location.pathname);
  const clusterList = survey.clusterLists[clusterIndex];
  const [kMeansLayers, setKMeansLayers] = useState<kmeans.KMeansLayer[]>([]);
  const [loadingGeoJson, errorGeoJson, geoJson, setGeoJson] =
    useGeoJson(geoJsonFilePath);

  // Get openAI instructions on the current page.
  useOpenai(addMessage, updatePrompt, parseInt(clusterId!), [
    `${survey.preferenceList.list[clusterIndex * CLUSTERING_SIZE].category}`,
    `${
      survey.preferenceList.list[clusterIndex * CLUSTERING_SIZE + 1].category
    }`,
  ]);

  // Filter geoJson data based on the selected clusters from the previous page.
  // Setting geoJson triggers the logic of this page to run.
  useEffect(() => {
    // Clean up mapbox layers before starting a new clustering page.
    mapbox.removeAllClusterLayers(kMeansLayers, mapViewer!);

    if (clusterIndex === 0 && kMeansLayers[0]?.geoJson) {
      setGeoJson(kMeansLayers[0].geoJson);
    } else if (clusterIndex > 0 && kMeansLayers[clusterIndex - 1]) {
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
    const color: Color = mapSections.find((sec) => sec.id === clusterName)!
      .color!;
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
    if (!mapViewer || !kMeansLayers[clusterIndex]) return;
    mapbox.addClusterLayer(kMeansLayers[clusterIndex], mapViewer!, false);

    // Remove KMeansLayer from mapbox when on unmount.
    return () => mapbox.removeAllClusterLayers(kMeansLayers, mapViewer!);
  }, [kMeansLayers, mapViewer]);

  // Update mapping on selected clusterList change
  useEffectAfterMount(() => {
    mapbox.updateClusterLayer(clusterList, mapViewer);
  }, [clusterList, mapViewer]);

  // Restore mapping on mapMode change
  useEffectAfterMount(() => {
    if (!mapViewer) return;

    const currentClusterLayer = mapViewer.getLayer(clusterList.name)!;
    const currentSources = mapViewer.getStyle()!.sources;

    mapViewer.on("style.load", () => {
      mapbox.removeAllClusterLayers(kMeansLayers, mapViewer!);

      // Restore sources
      Object.entries(currentSources).forEach(([id, source]) => {
        if (!mapViewer.getSource(id)) {
          mapViewer.addSource(id, source);
        }
      });

      // Restore current cluster layer.
      if (!mapViewer.getLayer(clusterList.name)) {
        mapViewer.addLayer(currentClusterLayer);
      }
      const section: Section = pathToSection(location.pathname);
      mapbox.setLayers(section, mapViewer);
      mapbox.updateClusterLayer(clusterList, mapViewer);
    });
  }, [mapMode]);

  // Display loading & error status of fetching geoJson data.
  if (loadingGeoJson) {
    return (
      <SidebarSection>
        <p>Loading GeoJson Data...</p>
      </SidebarSection>
    );
  }
  if (errorGeoJson) {
    return (
      <SidebarSection>
        <p>{errorGeoJson}</p>
      </SidebarSection>
    );
  }

  return (
    <>
      <Sidebar>
        <SidebarSection>
          <CheckboxListAI
            name={clusterName}
            list={clusterList.list}
            index={clusterIndex}
            kMeansLayers={kMeansLayers}
          />
        </SidebarSection>
      </Sidebar>

      <LegendSection
        title={`Clustering Step`}
        steps={getSeriesNumber(survey.clusterLists.length)}
        currentStep={parseInt(clusterId!)}
      >
        <DropdownManager
          lists={clusterList.list}
          displayChart
          displayColorbox
          // expandFirstList={!loadingMessage.json}
          autoCollapse
        />
      </LegendSection>

      <PopupContextProvider>
        <PopupSection enableSelectEffect>
          <PopupTextCluster text="cluster" />
        </PopupSection>
      </PopupContextProvider>
    </>
  );
}
