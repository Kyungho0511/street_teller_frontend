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
import { geoJsonfilePath, HealthcareFeatureCollection, HealthcarePropertyName } from "../constants/geoJsonConstants";
import { KMeansResult } from "ml-kmeans/lib/KMeansResult";

export default function Cluster() {
  const { survey, setSurveyContext } = useContext(SurveyContext);
  const { clusterId } = useParams<string>()!;
  const clusterIndex = parseInt(clusterId!) - 1;

  const [kMeansLayer, setKMeansLayer] = useState(null); 
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

    // Process the fetched data and run KMeans clustering.
    const data: number[][] = (kmeans.processData(geoJson, selectedAttributes));
    const kMeansResult = kmeans.run(data);

    console.log(kMeansResult);

    // Update clusterLists in the survey context.
  }, [clusterId, survey.preferenceList, geoJson]);



  // Update kMeansLayer on clusters checkbox change.
// const handleCheckboxChange = () => {}

  // Update mapping on kMeansLayer change.
  useEffect(() => {
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
