import { HealthcarePropertyName } from '../constants/geoJsonConstants';
import { Section } from "../constants/surveyConstants";
import { MapBound, UnitType, mapAttributes } from "../constants/mapConstants";


/**
 * Returns the section corresponding to the path.
 * @param path Url path name.
 * @returns Section name associated with the url path.
 */
export function pathToSection(path: string): Section {
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
 * Get the bound corresponding to the attribute name.
 * @param attribute name of the attribute in search for the bound.
 */
export function getBound(attribute: HealthcarePropertyName): MapBound {
    return mapAttributes.find((attr) => attr.name === attribute)!.bound;
}

/**
 * Get the unit type corresponding to the attribute name.
 * @param attribute name of the attribute in search for the unit type.
 */
export function getUnit(attribute: HealthcarePropertyName): UnitType | undefined {
  return mapAttributes.find((attr) => attr.name === attribute)?.unit;
}

/**
 * Format the number based on the unit type.
 * @param num number to be formatted.
 * @param unit unit type to be used for formatting.
 * @returns formatted string with the unit.
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