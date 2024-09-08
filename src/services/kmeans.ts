import { kmeans, Options } from 'ml-kmeans';
import { KMeansResult } from 'ml-kmeans/lib/KMeansResult';

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


export function prepareData(geoJson: any, attributes: string[]): any {
  
}

/**
 * 
 * @param geoJson 
 * @param attributes 
 * @returns 
 */
export function runKmeans(data: number[][], attributes: string[]): KMeansResult {

  // Filter data with selected attributes
  

  // Run kMeans clustering
  const options: Options = {
    seed: SEED,
    initialization: INITIALIZATION,
    maxIterations: MAX_ITERATIONS,
  };
  return kmeans(data, NUMBER_OF_CLUSTERS, options);
}

