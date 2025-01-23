import { useContext, useEffect, useState } from "react";
import LegendSection from "../components/organisms/LegendSection";
import Sidebar from "../components/organisms/Sidebar";
import SidebarSection from "../components/organisms/SidebarSection";
import { SurveyContext } from "../context/SurveyContext";
import { MapContext } from "../context/MapContext";
import useOpenaiInstruction from "../hooks/useOpenaiInstruction";
import { blendColors, crossReferenceList, pathToSection } from "../utils/utils";
import {
  Centroid,
  NUMBER_OF_CLUSTERING_STEPS,
  Report,
} from "../constants/surveyConstants";
import {
  HealthcareFeatureCollection,
  HealthcarePropertyName,
} from "../constants/geoJsonConstants";
import { getFilteredGeoJson } from "../services/kmeans";
import { addReportLayer } from "../services/mapbox";
import { defaultColor } from "../constants/mapConstants";
import { runOpenAI } from "../services/openai";
import { ReportPrompt } from "../constants/messageConstants";
import { MessageContext } from "../context/MessageContext";
import { useLocation } from "react-router-dom";

/**
 * Report page component where users select sites to report.
 */
export default function ReportPage() {
  const { survey, getClusterSurvey } = useContext(SurveyContext);
  const { messages } = useContext(MessageContext);
  const { mapViewer } = useContext(MapContext);
  const [geoJson, setGeoJson] = useState<HealthcareFeatureCollection>();

  const location = useLocation();
  const section = pathToSection(location.pathname);

  const reportName = "report";
  const lastClusterId = NUMBER_OF_CLUSTERING_STEPS;
  const lastCluster = `cluster${lastClusterId}`;
  const prevGeoJson = survey[lastCluster].geoJson;
  const run = messages[section].find((message) => message.type === "report")
    ? false
    : true;

  useOpenaiInstruction();

  // Prepare geoJson data for the report page.
  useEffect(() => {
    if (!prevGeoJson || !run) return;

    const selection = survey[lastCluster].list.map((item) => item.checked);
    const geoJson = getFilteredGeoJson(
      `${lastClusterId}`,
      selection,
      prevGeoJson
    );
    setGeoJson(geoJson);
  }, [prevGeoJson]);

  useEffect(() => {
    if (!geoJson) return;

    // Get unique reports from user selected clusters.
    const clusters = getClusterSurvey();
    const selectedClusterLists = clusters.map((cluster) =>
      cluster.list.filter((item) => item.checked)
    );
    const crossReference = crossReferenceList(selectedClusterLists);

    // Count the number of geoId for each report.
    const reports: Report[] = crossReference.map((list, index) => ({
      name: "",
      reasoning: "",
      clusters: list,
      color: defaultColor,
      geoIds: [],
      index,
      checked: true,
    }));
    geoJson.features.forEach((feature, index) => {
      const report = reports.find((report) =>
        report.clusters.every((cluster) => {
          const key = ("cluster" + cluster.clusterId) as HealthcarePropertyName;
          return feature.properties[key] === cluster.index;
        })
      );
      if (report) {
        report.geoIds.push(feature.properties.GEOID as string);

        // Assign the unique report index to each tract.
        geoJson.features[index].properties.report = report.index;
      }
    });

    // Filter out reports with no geoIds.
    reports.forEach((report, index) => {
      if (report.geoIds.length === 0) {
        reports.splice(index, 1);
      }
    });

    // Assign color to each report.
    reports.forEach((report) => {
      const colors = report.clusters.map((cluster) => cluster.color);
      const color = blendColors(colors);
      report.color = color;
    });

    // Construct prompts for OpenAI.
    const prompt: ReportPrompt = {
      type: "report",
      content: [],
    };
    reports.forEach((report) => {
      const obj: {
        clusters: { name: string; centroids: Centroid[]; reasoning: string }[];
      } = { clusters: [] };
      report.clusters.forEach((cluster) => {
        obj.clusters.push({
          name: cluster.name,
          centroids: cluster.centroids,
          reasoning: cluster.reasoning,
        });
      });
      prompt.content.push(obj);
    });

    // Get OpenAI response.
    runOpenAI(prompt).then((response) => {
      console.log(response);
    });

    // // Add the geoJson data to the map.
    // if (!mapViewer) return;
    // addReportLayer(reportName, geoJson, reports, mapViewer);

    // return () => {
    //   mapViewer.removeLayer(reportName);
    //   mapViewer.removeSource(reportName);
    // };
  }, [geoJson, mapViewer]);

  return (
    <>
      <Sidebar>
        <SidebarSection>
          <p>sidebar section</p>
        </SidebarSection>
      </Sidebar>

      <LegendSection title={"Title"}>
        <p>legend section</p>
      </LegendSection>
    </>
  );
}
