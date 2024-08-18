import Button from "../components/Button";
import CheckboxList from "../components/CheckboxList";
import DropdownManager from "../components/DropdownManager";
import Sidebar from "../components/Sidebar";
import SidebarSection from "../components/SidebarSection";
import { targetClusters, vulnerabilityLists } from "../constants/clusterConstants";

export default function Cluster() {
  return (
    <Sidebar>
      <SidebarSection title="Custom Clusters">
        <p>
          Add or remove features to customize your clustering analysis. Click
          the 'Cluster' button when you are ready.
        </p>
        <DropdownManager lists={vulnerabilityLists} />
        <Button text="cluster" color="grey" location="sidebar" />
      </SidebarSection>

      <SidebarSection title="Filter Target Clusters">
        <p>
          Review the subcategory values for each cluster in the legend. Exclude
          the clusters you're not targeting, and continue.
        </p>
        <CheckboxList name="select1" list={targetClusters} colorbox />
      </SidebarSection>
    </Sidebar>
  );
}