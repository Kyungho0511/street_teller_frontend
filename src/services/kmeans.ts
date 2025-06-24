import { kmeans, Options } from "ml-kmeans";
import { KMeansResult } from "ml-kmeans/lib/KMeansResult";
import { Feature } from "geojson";
import {
  TractFeature,
  TractFeatureCollection,
  HealthcareProperties,
} from "../constants/geoJsonConstants";
import {
  INITIALIZATION,
  MAX_ITERATIONS,
  NUMBER_OF_CLUSTERS,
  SEED,
} from "../constants/kMeansConstants";
import { normalize } from "../utils/utils";
import { Section } from "../constants/sectionConstants";

/**
 * Run kmeans clustering analysis.
 * @param data 2D array data to be clustered.
 * @returns KMeans clustering result.
 */
export function runKMeans(data: number[][]): KMeansResult {
  console.log("run KMeans with data: ", data.length);

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
  geoJson: TractFeatureCollection,
  attributes: HealthcareProperties[]
): number[][] {
  // Filter the features based on the selected attributes and tracts.
  const filteredFeatures = geoJson.features
    .filter((feature: TractFeature) => !feature.properties.disabled)
    .map((feature: TractFeature) => {
      let filteredProperties: Partial<{
        [key in HealthcareProperties]: number;
      }> = {};

      attributes.forEach((attr) => {
        if (Object.prototype.hasOwnProperty.call(feature.properties, attr)) {
          const normalized = normalize(
            feature.properties[attr] as number,
            attr
          );
          if (filteredProperties) {
            filteredProperties[attr] = normalized;
          } else {
            filteredProperties = { [attr]: normalized };
          }
        }
      });

      return {
        ...feature,
        properties: filteredProperties,
      };
    });
  // Convert the filtered features to a 2D array
  return filteredFeatures.map((item) => Object.values(item.properties));
}

/**
 * Add the kMeans clustering result to the geoJson.
 * @param geoJson The geoJson to be updated.
 * @param kMeansResult The kMeans clustering result.
 * @param key geoJson feature property key to assign the clustering result.
 */
export function addToGeoJson(
  geoJson: TractFeatureCollection,
  kMeansResult: KMeansResult,
  key: Section
): void {
  geoJson.features.forEach((feature: Feature, index) => {
    if (feature.properties!.disabled) {
      return;
    }
    feature.properties![key] = kMeansResult.clusters[index];
  });
}
