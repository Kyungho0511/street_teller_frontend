import { useContext, useEffect, useState } from "react";
import CheckboxList from "../components/CheckboxList";
import DropdownManager from "../components/DropdownManager";
import LegendSection from "../components/LegendSection";
import SidebarSection from "../components/SidebarSection";
import { clusteringSize, targetClusters } from "../constants/clusterConstants";
import { SurveyContext } from "../context/SurveyContext";
import { useParams } from "react-router-dom";

export default function Cluster() {
  const [datasets, setDatasets] = useState<string[]>([]);
  const { survey } = useContext(SurveyContext);
  const { clusterId } = useParams<string>()!;

  // Set datasets for clustering analysis
  useEffect(() => {
    const startIndex: number = clusteringSize * (parseInt(clusterId!) - 1);
    const endIndex: number = clusteringSize * parseInt(clusterId!);
    const subCategories: string[] = [];

    for (let i = startIndex, n = endIndex; i < n; i++) {
      if (survey.preferences.length - 1 < i) break;
      survey.preferences[i].subCategories.forEach((subCategory) => {
        subCategories.push(subCategory.name);
      });
    }
    setDatasets(subCategories);
  }, [clusterId, survey.preferences]);

  console.log(datasets);

  return (
    <>
      <SidebarSection title={"Filter Target Clusters"}>
        <p>
          Review the subcategory values for each cluster in the legend. Exclude
          the clusters you're not targeting, and continue.
        </p>
        <CheckboxList name="select1" list={targetClusters} colorbox />
      </SidebarSection>

      <LegendSection>
        <div></div>
      </LegendSection>
    </>
  );
}
