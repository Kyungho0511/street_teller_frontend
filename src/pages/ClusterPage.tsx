import { useContext, useEffect, useState } from "react";
import AIResponseList from "../components/molecules/AIReponseList";
import LegendSection from "../components/organisms/LegendSection";
import SidebarSection from "../components/organisms/SidebarSection";
import { SurveyContext } from "../context/SurveyContext";
import { useLocation, useParams } from "react-router-dom";
import * as kmeans from "../services/kmeans";
import { KMeansResult } from "ml-kmeans/lib/KMeansResult";
import { MapContext } from "../context/MapContext";
import * as utils from "../utils/utils";
import {
  geoJsonFilePath,
  HealthcareProperties,
  HealthcarePropertyName,
} from "../constants/geoJsonConstants";
import * as mapbox from "../services/mapbox";
import useGeoJson from "../hooks/useGeoJson";
import useEffectAfterMount from "../hooks/useEffectAfterMount";
import PopupSection from "../components/organisms/PopupSection";
import PopupContentCluster from "../components/atoms/PopupContentCluster";
import Sidebar from "../components/organisms/Sidebar";
import useOpenaiInstruction from "../hooks/useOpenaiInstruction";
import { CLUSTERING_SIZE } from "../constants/kMeansConstants";
import { MessageContext } from "../context/MessageContext";
import { ClusterPrompt } from "../constants/messageConstants";
import { streamOpenAI } from "../services/openai";
import { ClusterList } from "../constants/surveyConstants";
import { v4 as uuidv4 } from "uuid";
import CheckboxList from "../components/molecules/CheckboxList";
import Map3dViewer from "../components/organisms/Map3dViewer";
import { MapQueryContext } from "../context/MapQueryContext";

/**
 * Cluster page component which consists of three clustering sub-sections.
 */
export default function ClusterPage() {
  const { survey, getClusterSurvey, setClusterSurvey } =
    useContext(SurveyContext);
  const { mapViewer, mapMode, parentLayer } = useContext(MapContext);
  const { messages } = useContext(MessageContext);
  const { selectedCluster, setSelectedCluster, setSelectedFeaturePosition } =
    useContext(MapQueryContext);

  const [legendTitle, setLegendTitle] = useState<string>("");
  const [prompts, setPrompts] = useState<ClusterPrompt[]>(
    Array(3).fill(undefined)
  );
  const { clusterId } = useParams<string>()!;
  const clusterIndex = parseInt(clusterId!) - 1;
  const location = useLocation();
  const clusterName = `cluster${clusterId}` as ClusterList["name"];
  const clusterList = survey[clusterName as ClusterList["name"]]!;

  const section = utils.pathToSection(location.pathname);
  const run = messages[section].find((message) => message.type === "cluster")
    ? false
    : true;

  // Run the clustering logic if a cluster message is not found.
  const [loadingGeoJson, errorGeoJson, geoJson, setGeoJson] = useGeoJson(
    geoJsonFilePath,
    run
  );

  useOpenaiInstruction(parseInt(clusterId!), [
    `${survey.preference.list[clusterIndex * CLUSTERING_SIZE].category}`,
    `${survey.preference.list[clusterIndex * CLUSTERING_SIZE + 1].category}`,
  ]);

  // Filter geoJson data based on the selected clusters from the previous page.
  // Setting geoJson triggers the logic of this page to run.
  useEffect(() => {
    if (!mapViewer || !run) {
      return;
    }
    const clusterSurvey = getClusterSurvey();

    // Clean up mapbox layers before starting a new clustering page.
    mapbox.removeAllClusterLayers(clusterSurvey, mapViewer!);

    if (clusterIndex === 0 && clusterSurvey[0]?.geoJson) {
      setGeoJson(clusterSurvey[0].geoJson);
    } else if (clusterIndex > 0) {
      const prevClusterList = clusterSurvey[clusterIndex - 1];

      const selection: boolean[] = prevClusterList.list.map(
        (cluster) => cluster.checked
      );

      const filteredGeoJson = kmeans.getFilteredGeoJson(
        clusterIndex.toString(),
        selection,
        prevClusterList.geoJson!
      );
      setGeoJson(filteredGeoJson);
    }
  }, [location.pathname, mapViewer]);

  useEffectAfterMount(() => {
    if (!geoJson) return;

    // Get attributes selected by users.
    const startIndex = CLUSTERING_SIZE * (parseInt(clusterId!) - 1);
    const endIndex = CLUSTERING_SIZE * parseInt(clusterId!);
    const selectedAttributes: HealthcarePropertyName[] = [];

    for (let i = startIndex, n = endIndex; i < n; i++) {
      if (survey.preference.list.length - 1 < i) break;
      survey.preference.list[i].subCategories.forEach((subCategory) => {
        selectedAttributes.push(subCategory.name);
      });
    }

    // Set cluster list based on the selected attributes.
    const data: number[][] = kmeans.processData(geoJson!, selectedAttributes);
    const kMeansResult: KMeansResult = kmeans.runKMeans(data);
    const kMeansGeoJson = kmeans.assignToGeoJson(
      geoJson,
      kMeansResult,
      clusterId!
    );

    const newClusterList: ClusterList = {
      name: clusterName,
      list: clusterList.list,
      colors: clusterList.colors,
      geoJson: kMeansGeoJson,
      attributes: selectedAttributes,
      kMeansResult,
    };

    // Add clusters to the map.
    mapbox.addClusterLayer(kMeansGeoJson, newClusterList, mapViewer!);

    // Prepare prompt and list for OpenAI.
    newClusterList.list.forEach((item, i) => {
      item.centroids = selectedAttributes.map((attr, j) => ({
        name: attr,
        value: newClusterList.kMeansResult!.centroids[i][j],
        id: uuidv4(),
      }));
    });
    const prompt: ClusterPrompt = {
      type: "cluster",
      content: clusterList.list.map((item) => ({
        name: item.name,
        centroids: item.centroids,
      })),
    };
    setPrompts((prev) =>
      prev.map((item, i) => (i === clusterIndex ? prompt : item))
    );

    setClusterSurvey(clusterId!, newClusterList);

    return () => {
      // Remove KMeansLayer from mapbox on unmount.
      mapbox.removeAllClusterLayers(getClusterSurvey(), mapViewer!);
    };
  }, [survey.preference.list, geoJson]);

  // Update mapping on selected clusterList change
  useEffectAfterMount(() => {
    if (!mapViewer) return;

    mapbox.updateClusterLayer(clusterId!, clusterList, mapViewer);
  }, [clusterList, mapViewer]);

  // Restore mapping on mapMode change
  useEffectAfterMount(() => {
    if (!mapViewer) return;

    const currentClusterLayer = mapViewer.getLayer(clusterList.name)!;
    const currentSources = mapViewer.getStyle()!.sources;

    mapViewer.on("style.load", () => {
      mapbox.removeAllClusterLayers(getClusterSurvey(), mapViewer!);

      // Restore sources
      Object.entries(currentSources).forEach(([id, source]) => {
        if (!mapViewer.getSource(id)) {
          mapViewer.addSource(id, source);
        }
      });

      // Restore current cluster layer.
      if (!mapViewer.getLayer(clusterList.name)) {
        mapViewer.addLayer(currentClusterLayer, "road-simple");
      }
      mapbox.setLayers(section, mapViewer);
      mapbox.updateClusterLayer(clusterId!, clusterList, mapViewer);
    });
  }, [mapMode]);

  // Set queried properties based on the map mouse event for Legend.
  useEffect(() => {
    if (!mapViewer) return;

    const handleClick = (event: mapboxgl.MapMouseEvent) => {
      // Set the legend title
      const feature = mapViewer.queryRenderedFeatures(event.point, {
        layers: [parentLayer],
      })[0];
      if (!feature) return;
      const property = feature.properties as HealthcareProperties;
      const geoid = property.GEOID.toString();
      const neighborhoodName = utils.getNeighborhoodName(geoid);
      const countyName = utils.getCountyName(geoid);
      setLegendTitle(`${neighborhoodName}, ${countyName}`);

      // Set the center longitude and latitude of the selected polygon.
      if (!(feature.geometry.type === "Polygon")) return;
      const coordinates = feature.geometry.coordinates[0];
      const center = utils.getCenterCoordinate(coordinates);
      setSelectedFeaturePosition(center);
    };

    mapViewer.on("click", handleClick);

    return () => {
      mapViewer.off("click", handleClick);
    };
  }, [mapViewer]);

  // Display loading & error status of fetching geoJson data.
  if (loadingGeoJson) {
    return (
      <Sidebar>
        <SidebarSection>
          <p>Loading GeoJson Data...</p>
        </SidebarSection>
      </Sidebar>
    );
  }
  if (errorGeoJson) {
    return (
      <Sidebar>
        <SidebarSection>
          <p>{errorGeoJson}</p>
        </SidebarSection>
      </Sidebar>
    );
  }

  return (
    <>
      <Sidebar>
        <SidebarSection>
          <AIResponseList
            surveyName={clusterName}
            list={clusterList.list}
            listType={CheckboxList}
            colors={clusterList.colors}
            prompt={prompts[clusterIndex]}
            streamOpenAI={() =>
              streamOpenAI(
                prompts[clusterIndex],
                messages[section],
                survey.preference.list,
                clusterIndex
              )
            }
          />
        </SidebarSection>
      </Sidebar>

      <LegendSection
        title={legendTitle}
        visible={selectedCluster !== undefined}
        onClose={() => setSelectedCluster(undefined)}
      >
        <Map3dViewer visible={selectedCluster !== undefined} />
        <p>{`Selected Cluster: ${selectedCluster}`}</p>
      </LegendSection>

      {/* <LegendSection
          title={`Clustering Step`}
        >
          <DropdownManager
            lists={clusterList.list}
            listType={BarChartDropdownList}
            autoCollapse
          />
        </LegendSection> */}

      <PopupSection enableSelectEffect>
        <PopupContentCluster clusterId={clusterId!} />
      </PopupSection>
    </>
  );
}
