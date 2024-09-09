import { kmeans, Options } from 'ml-kmeans';
import { KMeansResult } from 'ml-kmeans/lib/KMeansResult';
import {
  HealthcareFeature,
  HealthcareFeatureCollection,
  HealthcarePropertyName,
} from "../constants/geoJsonConstants";

// Number of preferences to be used for each clustering analysis.
export const CLUSTERING_SIZE = 2;

// Number of clusters to be created per clustering analysis.
const NUMBER_OF_CLUSTERS = 4;

// Maximum number of iterations for kMeans clustering.
const MAX_ITERATIONS = 100;

// Seed for KMeans clustering results.
const SEED = 10;

// Initialization method for KMeans clustering.
const INITIALIZATION = "kmeans++";

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
      let filteredProperties: Partial<{ [key in HealthcarePropertyName]: number }> = {};
      attributes.forEach((attr) => {
        if (Object.prototype.hasOwnProperty.call(feature.properties, attr)) {
          if (filteredProperties) {
            filteredProperties[attr] = feature.properties[attr];
          }
          else {
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
 * Run kmeans clustering analysis.
 * @param data 2D array data to be clustered.
 * @returns KMeans clustering result.
 */
export function run(data: number[][]): KMeansResult {
  // Run kMeans clustering
  const options: Options = {
    seed: SEED,
    initialization: INITIALIZATION,
    maxIterations: MAX_ITERATIONS,
  };
  return kmeans(data, NUMBER_OF_CLUSTERS, options);
}

