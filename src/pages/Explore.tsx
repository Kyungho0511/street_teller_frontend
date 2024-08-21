import DropdownManager from "../components/DropdownManager";
import SidebarSection from "../components/SidebarSection";
import { secondaryLists, targetLists } from "../constants/exploreConstants";

export default function Explore() {
  return (
    <>
      <SidebarSection title="Explore Datasets">
        <p>
          Explore datasets of shortage areas by comparing target data on
          shortages with other secondary data. Add or remove datasets as needed
          for the clustering analysis of healthcare shortages. Once you are
          finished, click the "Continue" button.
        </p>
      </SidebarSection>

      <SidebarSection title="Select Target Data">
        <DropdownManager
          lists={targetLists}
          defaultItem="Unserved population / km2"
          selectable
          autoCollapse
        />
      </SidebarSection>

      <SidebarSection title="Select Secondary Data">
        <DropdownManager
          lists={secondaryLists}
          defaultItem="Current lack of health insurance"
          selectable
          autoCollapse
        />
      </SidebarSection>

      <SidebarSection title="Added Features">
        <p>added features</p>
      </SidebarSection>
    </>
  );
}