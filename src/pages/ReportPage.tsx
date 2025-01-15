import { useContext, useEffect } from "react";
import CheckboxList from "../components/molecules/CheckboxList";
import DropdownManager from "../components/molecules/DropdownManager";
import LegendSection from "../components/organisms/LegendSection";
import Sidebar from "../components/organisms/Sidebar";
import SidebarSection from "../components/organisms/SidebarSection";
import { SurveyContext } from "../context/SurveyContext";
import { KMeansContext } from "../context/KMeansContext";
import { MapContext } from "../context/MapContext";
import * as mapbox from "../services/mapbox";
import useOpenaiInstruction from "../hooks/useOpenaiInstruction";
import { crossReferenceList } from "../utils/utils";
// import { ClusterCheckboxItem } from "../constants/surveyConstants";

/**
 * Report page component where users select sites to report.
 */
export default function ReportPage() {
  const { survey } = useContext(SurveyContext);
  const { mapViewer, parentLayer } = useContext(MapContext);
  const { kMeansLayers } = useContext(KMeansContext);

  // Temporary cluster list for testing.
  const clusterList = survey.clusterLists[2];

  useOpenaiInstruction();

  // Get unique combinations from user selected clusters.
  useEffect(() => {
    const selectedClusterLists = survey.clusterLists.map((cluster) =>
      cluster.list.filter((item) => item.checked)
    );
    const uniqueCombinations = crossReferenceList(selectedClusterLists);
  }, [survey.clusterLists]);

  // Add the last KMeansLayer to the map.
  useEffect(() => {
    if (!mapViewer || !kMeansLayers.length) return;
    mapbox.addReportLayer(
      parentLayer,
      kMeansLayers[kMeansLayers.length - 1],
      mapViewer
    );

    return () => {
      mapViewer.removeLayer(parentLayer);
      mapViewer.removeSource(parentLayer);
    };
  }, []);

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
