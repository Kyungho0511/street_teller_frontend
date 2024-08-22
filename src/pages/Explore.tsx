import DropdownManager from "../components/DropdownManager";
import SidebarSection from "../components/SidebarSection";
import { secondaryLists, targetLists } from "../constants/exploreConstants";

export default function Explore() {
  return (
    <>
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