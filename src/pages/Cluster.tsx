import Button from "../components/Button";
import CheckboxList from "../components/CheckboxList";
import DropdownManager from "../components/DropdownManager";
import LegendSection from "../components/LegendSection";
import SidebarSection from "../components/SidebarSection";
import { targetClusters, vulnerabilityLists } from "../constants/clusterConstants";

export default function Cluster() {
  return (
    <>
      <SidebarSection title="Filter Target Clusters">
        <p>
          Review the subcategory values for each cluster in the legend. Exclude
          the clusters you're not targeting, and continue.
        </p>
        <CheckboxList name="select1" list={targetClusters} colorbox />
      </SidebarSection>

      <LegendSection>
        
      </LegendSection>
    </>
  );
}