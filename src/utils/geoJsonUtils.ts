import {
  clusterProperties,
  ClusterProperties,
  TractFeatureCollection,
} from "../constants/geoJsonConstants";
import {
  ClusterList,
  ClusterPropertiesDict,
  ReportList,
} from "../constants/surveyConstants";

/**
 * Update user's selection state of clusters to the geoJson.
 * @param geoJson GeoJson to be modified.
 * @param clusterList Cluster list to be applied.
 */
export function updateSelection(
  geoJson: TractFeatureCollection,
  clusterList: ClusterList | ReportList
): void {
  const selections = clusterList.list.map((item) => item.checked);
  const names = clusterList.list.map((item) => item.name);
  const key = clusterList.name as ClusterProperties;
  geoJson.features.forEach((feature) => {
    if (feature.properties.disabled) {
      return;
    }
    const clusterIdx = feature.properties[key] as number;
    feature.properties.selected = selections[clusterIdx] && !!names[clusterIdx];
  });
}
/**
 * Get the cluster properties of clustering analysis
 * from the geoJson for session storage purpose.
 * @param geoJson The geoJson to get the properties from.
 */
export function getClusterProps(
  geoJson: TractFeatureCollection
): ClusterPropertiesDict {
  const dict = {} as ClusterPropertiesDict;
  geoJson.features.forEach((feature) => {
    const geoId = feature?.properties?.GEOID;
    if (geoId) {
      const properties = Object.entries(feature.properties).filter(([key]) =>
        clusterProperties.includes(key as ClusterProperties)
      );
      dict[geoId as string] = Object.fromEntries(properties) as Record<
        ClusterProperties,
        string | boolean
      >;
    }
  });
  return dict;
}

/**
 * Set disabled properties based on the selection status of previous clusters.
 * @param geoJson GeoJson to be modified.
 * @param prevClusters previous cluster lists to extract selection status.
 */
export function setDisabled(
  geoJson: TractFeatureCollection,
  prevClusters: ClusterList[]
) {
  prevClusters.forEach((clusterList) => {
    const selections = clusterList.list.map((item) => item.checked);
    const key = clusterList.name as ClusterProperties;

    geoJson.features.forEach((feature) => {
      if (feature.properties.disabled) {
        return;
      }
      const clusterIdx = feature.properties[key] as number;
      feature.properties.disabled = !selections[clusterIdx];
    });
  });
}
