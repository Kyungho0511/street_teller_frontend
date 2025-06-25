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
import { KMeansDict } from "../constants/surveyConstants";

/**
 * Run kmeans clustering analysis.
 * @param data 2D array data to be clustered.
 * @returns KMeans clustering result.
 */
export function runKMeans(
  data: number[][],
  geoJson: TractFeatureCollection
): { kMeansDict: KMeansDict; centroidsList: number[][] } {
  const options: Options = {
    seed: SEED,
    initialization: INITIALIZATION,
    maxIterations: MAX_ITERATIONS,
  };
  const kMeansResult: KMeansResult = kmeans(data, NUMBER_OF_CLUSTERS, options);
  const geoIds = geoJson.features
    .filter((feature) => !feature.properties.disabled)
    .map((feature) => feature.properties.GEOID as string);
  const entries = kMeansResult.clusters.map((cluster, index) => [
    geoIds[index],
    cluster,
  ]);
  const kMeansDict = Object.fromEntries(entries);

  return { kMeansDict, centroidsList: kMeansResult.centroids };
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
 * @param kMeansDict The kMeans dictionary with geoId as key and cluster index as value.
 * @param key geoJson feature property key to assign the clustering result.
 */
export function addToGeoJson(
  geoJson: TractFeatureCollection,
  kMeansDict: KMeansDict,
  key: Section
): void {
  geoJson.features.forEach((feature: Feature) => {
    if (feature.properties!.disabled) {
      return;
    }
    const geoId = feature.properties!.GEOID as string;
    feature.properties![key] = kMeansDict[geoId];
  });
}
