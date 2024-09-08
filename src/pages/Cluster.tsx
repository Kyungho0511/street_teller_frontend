import { useContext, useEffect, useState } from "react";
import CheckboxList from "../components/CheckboxList";
import DropdownManager from "../components/DropdownManager";
import LegendSection from "../components/LegendSection";
import SidebarSection from "../components/SidebarSection";
import { SurveyContext } from "../context/SurveyContext";
import { useParams } from "react-router-dom";
import { clusterLists } from "../constants/surveyConstants";
import { CLUSTERING_SIZE } from "../services/kmeans";
import * as kmeans from "../services/kmeans";
import { HealthcareFeatureCollection } from "../constants/geoJsonConstants";

export default function Cluster() {
  const { survey, setSurveyContext } = useContext(SurveyContext);
  const { clusterId } = useParams<string>()!;
  const clusterIndex = parseInt(clusterId!) - 1;

  const [error, setError] = useState<string>(""); // error message for the fetch request
  const [loading, setLoading] = useState<boolean>(true); // loading status for the fetch request
  const [geoJson, setGeoJson] = useState<HealthcareFeatureCollection>({
    type: "FeatureCollection",
    features: [],
  }); 
  const [processedData, setProcessedData] = useState<number[][]>([]); 

  const geoJsonfilePath = "/data/tracts_features_nyc_normalized.geojson";

  // 1.Set GeoJson.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(geoJsonfilePath);
        if (!response.ok) {
          throw new Error("Network error: " + response.statusText);
        }
        const result = await response.json();
        setGeoJson(result);
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

  console.log("geoJson: ", geoJson);

  // 2.Set processed data.
  useEffect(() => {
    // Get attributes selected by users.
    const startIndex: number = CLUSTERING_SIZE * (parseInt(clusterId!) - 1);
    const endIndex: number = CLUSTERING_SIZE * parseInt(clusterId!);
    const selectedAttributes: string[] = [];

    for (let i = startIndex, n = endIndex; i < n; i++) {
      if (survey.preferenceList.length - 1 < i) break;
      survey.preferenceList[i].subCategories.forEach((subCategory) => {
        selectedAttributes.push(subCategory.name);
      });
    }

    // Filter the fetched data and run KMeans clustering.
    kmeans.prepareData(geoJson, selectedAttributes);

    // Update clusterLists in the survey context.
  }, [clusterId, survey.preferenceList, geoJson]);

  // 3.Update mapping and legend.
  useEffect(() => {
    // Update mapping with clustering result.
    // Update the legend section.
  }, [survey.clusterLists[clusterIndex].list]);

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
