import { HealthcareFeatureCollection } from '../constants/geoJsonConstants';
import { Section } from "../constants/surveyConstants";
import { MapBound, UnitType, mapAttributes } from "../constants/mapConstants";
import { FeatureCollection } from "geojson";


/**
 * Returns the section corresponding to the path.
 * @param path Url path name.
 * @returns Section name associated with the url path.
 */
export function pathToSection(path: string): Section {
  console.log(path); 

  switch (path) {
    case "/":
      return "home";
    case "/cluster/1":
      return "cluster1";
    case "/cluster/2":
      return "cluster2";
    case "/cluster/3":
      return "cluster3";
    default:
      return "home";
  }
}

/**
 * Returns the bound corresponding to the layer name.
 * @param layer Name of the layer to search for the bound.
 * @returns 
 */
export function getBound(layer: string): MapBound | undefined {
    return mapAttributes.find((attribute) => attribute.name === layer)?.bound;
}

/**
 * Format the number based on the unit type.
 * @param num Number to be formatted.
 * @param unit Unit type to be used for formatting.
 * @returns Formatted number with the unit.
 */
export function formatUnit(num: number, unit: UnitType): string {
  switch (unit) {
    case "population density":
      return `${Math.round(num / 100) / 10}k`;
    case "percentage":
      return `${Math.round(num)}%`;
    case "percentage * 100":
      return `${Math.round(num * 100)}%`;
    case "dollar":
      return `$ ${Math.round(num).toLocaleString("en-US")}`;
    case "dollar * 50":
      return `$ ${Math.round(num * 50).toLocaleString("en-US")}`;
    default: 
      return `${Math.round(num)}`;
  }
}

/**
 * Get GeoJson features filtered with indexes.
 * @param geoJson 
 * @param indexes 
 * @returns 
 */
export function filterGeoJsonFeatures(geoJson: any, indexes: number[]): any {
  // Filter GeoJson features array based on the indexes
  const filteredFeatures = geoJson.features.filter((feature: object, i: number) =>
    indexes.includes(i)
  );
  const filteredGeoJson = structuredClone(geoJson);
  filteredGeoJson.features = filteredFeatures;

  return filteredGeoJson;
}