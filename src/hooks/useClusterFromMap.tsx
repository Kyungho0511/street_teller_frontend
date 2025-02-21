import { useContext, useState } from "react";
import { Cluster } from "../constants/surveyConstants";
import { MapQueryContext } from "../context/MapQueryContext";
import { Survey, SurveyContext } from "../context/SurveyContext";
import {
  HealthcareProperties,
  HealthcarePropertyName,
} from "../constants/geoJsonConstants";
import useEffectAfterMount from "./useEffectAfterMount";

/**
 * Custom hook to get features from the map.
 */
export default function useClusterFromMap(clusterId: string) {
  const { survey } = useContext(SurveyContext);
  const { hoveredProperty, selectedProperty } = useContext(MapQueryContext);
  const [hoveredClusters, setHoveredClusters] = useState<Cluster[]>();
  const [currentHoveredCluster, setCurrentHoveredCluster] = useState<Cluster>();
  const [selectedClusters, setSelectedClusters] = useState<Cluster[]>();
  const [currentSelectedCluster, setCurrentSelectedCluster] =
    useState<Cluster>();

  // Helper function to get clusters for a property
  const getClusters = (property: HealthcareProperties | undefined) => {
    if (!property) return;

    const clusters: Cluster[] = [];
    for (let i = 1, n = parseInt(clusterId) + 1; i < n; i++) {
      const clusterKey = `cluster${i}`;
      const clusterList = survey[clusterKey as keyof Survey];
      const cluster =
        clusterList.list[
          property[clusterKey as HealthcarePropertyName] as number
        ];
      clusters.push(cluster as Cluster);
    }
    return clusters;
  };

  // Set clusters based on the Hovered property's cluster ID.
  useEffectAfterMount(() => {
    const clusters = getClusters(hoveredProperty) as Cluster[];
    if (!clusters || clusters.length === 0) return;

    setHoveredClusters(clusters);
    setCurrentHoveredCluster(clusters[clusters.length - 1]);
  }, [hoveredProperty]);

  // Set clusters based on the Selected property's cluster ID.
  useEffectAfterMount(() => {
    const clusters = getClusters(selectedProperty) as Cluster[];
    if (!clusters || clusters.length === 0) return;

    setSelectedClusters(clusters);
    setCurrentSelectedCluster(clusters[clusters.length - 1]);
  }, [selectedProperty]);

  return {
    hoveredClusters,
    currentHoveredCluster,
    selectedClusters,
    currentSelectedCluster,
  };
}
