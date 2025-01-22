import { kmeans, Options } from "ml-kmeans";
import { KMeansResult } from "ml-kmeans/lib/KMeansResult";
import { Feature } from "geojson";
import {
  HealthcareFeature,
  HealthcareFeatureCollection,
  HealthcarePropertyName,
} from "../constants/geoJsonConstants";
import {
  INITIALIZATION,
  MAX_ITERATIONS,
  NUMBER_OF_CLUSTERS,
  SEED,
} from "../constants/kMeansConstants";

/**
 * Run kmeans clustering analysis.
 * @param data 2D array data to be clustered.
 * @returns KMeans clustering result.
 */
export function runKMeans(data: number[][]): KMeansResult {
  // Run kMeans clustering
  const options: Options = {
    seed: SEED,
    initialization: INITIALIZATION,
    maxIterations: MAX_ITERATIONS,
  };
  return kmeans(data, NUMBER_OF_CLUSTERS, options);
}

/**
 * Process geojson data into 2D array for clustering analysis.
 * @param geoJson The raw geojson data.
 * @param attributes Names of the attributes to filter the data.
 * @returns 2D array of the filtered data.
 */
export function processData(
  geoJson: HealthcareFeatureCollection,
  attributes: HealthcarePropertyName[]
): number[][] {
  // Filter the features based on the selected attributes
  const filteredFeatures = geoJson.features.map(
    (feature: HealthcareFeature) => {
      let filteredProperties: Partial<{
        [key in HealthcarePropertyName]: number;
      }> = {};
      attributes.forEach((attr) => {
        if (Object.prototype.hasOwnProperty.call(feature.properties, attr)) {
          if (filteredProperties) {
            filteredProperties[attr] = feature.properties[attr] as number;
          } else {
            filteredProperties = { [attr]: feature.properties[attr] };
          }
        }
      });
      return {
        ...feature,
        properties: filteredProperties,
      };
    }
  );
  // Convert the filtered features to a 2D array
  return filteredFeatures.map((item) => Object.values(item.properties));
}

/**
 * Assign the kMeans clustering result to the geoJson.
 */
export function assignToGeoJson(
  geoJson: HealthcareFeatureCollection,
  kMeans: KMeansResult,
  clusterId: string
): HealthcareFeatureCollection {
  // Deep copy data and set clustering result values.
  const kMeansGeoJson = structuredClone(geoJson);
  kMeansGeoJson.features.forEach((feature: Feature, index) => {
    feature.properties!["cluster" + clusterId] = kMeans.clusters[index];
  });
  return kMeansGeoJson;
}

/**
 * Filter GeoJSON with the selected census tracts based on the user's selection of clusters.
 * @param prevClusterId previous clustering iteration number.
 * @param selection user's selection of clusters.
 * @param geoJson geoJson that contains the kmeans clustering results.
 */
export function getFilteredGeoJson(
  prevClusterId: string,
  selection: boolean[],
  geoJson: HealthcareFeatureCollection
): HealthcareFeatureCollection {
  const filteredGeoJson = structuredClone(geoJson);
  filteredGeoJson.features = geoJson.features.filter((feature) => {
    const clusterKey = ("cluster" + prevClusterId) as HealthcarePropertyName;
    const cluster = feature.properties![clusterKey];
    return selection[cluster as number];
  });

  return filteredGeoJson;
}
