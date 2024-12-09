import { useContext } from "react";
import CheckboxList from "../components/molecules/CheckboxList";
import DropdownManager from "../components/molecules/DropdownManager";
import LegendSection from "../components/organisms/LegendSection";
import Sidebar from "../components/organisms/Sidebar";
import SidebarSection from "../components/organisms/SidebarSection";
import { SurveyContext } from "../context/SurveyContext";

/**
 * Select page component where users select sites to report.
 */
export default function SelectPage() {
  const { survey } = useContext(SurveyContext);
  const clusterList = survey.clusterLists[2];

  return (
    <>
      <Sidebar>
        <SidebarSection>
          <CheckboxList name={"Title"} list={clusterList.list} />
        </SidebarSection>
      </Sidebar>

      <LegendSection title={"Title"}>
        <DropdownManager
          lists={clusterList.list}
          displayChart
          displayColorbox
          autoCollapse
        />
      </LegendSection>
    </>
  );
}
