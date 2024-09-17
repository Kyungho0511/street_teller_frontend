import { kmeans, Options } from 'ml-kmeans';
import { KMeansResult } from 'ml-kmeans/lib/KMeansResult';
import { Hex } from '../constants/mapConstants';
import { Feature, FeatureCollection } from 'geojson';
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

export type KMeansLayer = {
  geoJson: FeatureCollection;
  centroids: number[][];
  title: string;
  colors: Hex[];
  attributes: HealthcarePropertyName[];
}

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
 * Set the kMeans clustering result as a layer object for mapping.
 */
export function setLayer(
  kMeans: KMeansResult,
  geoJson: HealthcareFeatureCollection,
  title: string,
  colors: Hex[],
  attributes: HealthcarePropertyName[]
): KMeansLayer {

    // Deep copy data and set clustering result values.
    const kMeansGeoJson = structuredClone(geoJson);
    kMeansGeoJson.features.forEach((feature: Feature, index) => {
      feature.properties = {};
      feature.properties.cluster = kMeans.clusters[index];
    });

    const kMeansLayer: KMeansLayer = {
      geoJson: kMeansGeoJson,
      centroids: kMeans.centroids,
      title: title,
      colors: colors,
      attributes: attributes,
    };

    return kMeansLayer;
}