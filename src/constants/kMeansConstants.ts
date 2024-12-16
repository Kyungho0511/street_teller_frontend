import {
  HealthcareFeatureCollection,
  HealthcarePropertyName,
} from "./geoJsonConstants";
import { RGBA } from "./mapConstants";

// Number of preferences to be used for each clustering analysis.
export const CLUSTERING_SIZE = 2;

// Number of clusters to be created per clustering analysis.
export const NUMBER_OF_CLUSTERS = 4;

// Maximum number of iterations for kMeans clustering.
export const MAX_ITERATIONS = 100;

// Seed for KMeans clustering results.
export const SEED = 10;

// Initialization method for KMeans clustering.
export const INITIALIZATION = "kmeans++";

export type KMeansLayer = {
  geoJson: HealthcareFeatureCollection;
  centroids: number[][];
  title: string;
  colors: RGBA[];
  attributes: HealthcarePropertyName[];
};
