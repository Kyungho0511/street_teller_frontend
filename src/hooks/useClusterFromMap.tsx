import { useContext, useState } from "react";
import { Cluster } from "../constants/surveyConstants";
import { MapQueryContext } from "../context/MapQueryContext";
import { Survey, SurveyContext } from "../context/SurveyContext";
import { HealthcarePropertyName } from "../constants/geoJsonConstants";
import useEffectAfterMount from "./useEffectAfterMount";

/**
 * Custom hook to get clusters from the map.
 */
export default function useClusterFromMap(clusterId: string) {
  const { survey } = useContext(SurveyContext);
  const { property } = useContext(MapQueryContext);
  const [clusters, setClusters] = useState<Cluster[]>();

  useEffectAfterMount(() => {
    if (!property) return;

    // Set clusters based on the property's cluster ID.
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
    setClusters(clusters);
  }, [property]);

  return [clusters] as const;
}
