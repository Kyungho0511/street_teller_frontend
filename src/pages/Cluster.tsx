import { useContext, useEffect, useState } from "react";
import CheckboxList from "../components/molecules/CheckboxList";
import DropdownManager from "../components/molecules/DropdownManager";
import LegendSection from "../components/organisms/LegendSection";
import SidebarSection from "../components/organisms/SidebarSection";
import { SurveyContext } from "../context/SurveyContext";
import { useLocation, useParams } from "react-router-dom";
import { clusterLists } from "../constants/surveyConstants";
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

/**
 * Cluster page component, which consists of three sub-sections.
 */
export default function Cluster() {
  const { survey, setSurveyContext } = useContext(SurveyContext);
  const { map } = useContext(MapContext);
  const { clusterId } = useParams<string>()!;
  const clusterIndex = parseInt(clusterId!) - 1;
  const location = useLocation();

  const [kMeansLayer, setKMeansLayer] = useState<kmeans.KMeansLayer>();
  const [error, setError] = useState<string>(""); // error message for the fetch request
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
          setError(error.message);
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
      if (survey.preferenceList.length - 1 < i) break;
      survey.preferenceList[i].subCategories.forEach((subCategory) => {
        selectedAttributes.push(subCategory.name);
      });
    }

    // Set KMeansLayer based on the selected attributes.
    const data: number[][] = kmeans.processData(geoJson, selectedAttributes);
    const kMeansResult: KMeansResult = kmeans.run(data);
    const title = pathToSection(location.pathname) as string;
    const color: Color = mapSections.find((sec) => sec.id === title)!.color!;
    setKMeansLayer(kmeans.setLayer(kMeansResult, geoJson, title, color));
  }, [clusterId, survey.preferenceList, geoJson, location.pathname]);

  // Add KMeansLayer to the map.
  useEffect(() => {
    if (!kMeansLayer || !map) return;

    // Check if the source already exists, and remove it if necessary
    if (map.getSource(kMeansLayer.title)) {
      map.removeLayer(kMeansLayer.title);
      map.removeSource(kMeansLayer.title);
    }

    // Add the source and layer to the map
    map.addSource(kMeansLayer.title, {
      type: "geojson",
      data: kMeansLayer.geoJson,
    });
    map.addLayer(
      {
        id: kMeansLayer.title,
        type: "fill",
        source: kMeansLayer.title,
        paint: {
          "fill-color": [
            "case",
            ["==", ["get", "cluster"], 0],
            kMeansLayer.color.categorized[0],
            ["==", ["get", "cluster"], 1],
            kMeansLayer.color.categorized[1],
            ["==", ["get", "cluster"], 2],
            kMeansLayer.color.categorized[2],
            ["==", ["get", "cluster"], 3],
            kMeansLayer.color.categorized[3],
            "#ffffff",
          ],
          "fill-opacity": 1,
          "fill-outline-color": "rgba(217, 217, 217, 0.36)",
        },
      },
      "road-simple"
    );
  }, [kMeansLayer, map]);

  // Update kMeansLayer on clusters checkbox change.
  // const handleCheckboxChange = () => {}

  // Update mapping on kMeansLayer change.
  useEffect(() => {}, [survey.clusterLists[clusterIndex].list]);

  return (
    <>
      <SidebarSection title={"Filter Target Clusters"}>
        <p>
          Review the subcategory values for each cluster in the legend. Exclude
          the clusters you're not targeting, and continue.
        </p>
        <CheckboxList
          name="select1"
          list={clusterLists[clusterIndex].list}
          colorbox
        />
      </SidebarSection>

      <LegendSection>
        <div></div>
      </LegendSection>
    </>
  );
}
