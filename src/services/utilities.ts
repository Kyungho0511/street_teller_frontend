import { Section } from "../constants/homeConstants";
import { MapBound, UnitType, mapAttributes } from "../constants/mapConstants";

// Returns the section corresponding to the path.
export function pathToSection(path: string): Section {
  switch (path) {
    case "/":
      return "home";
    case "/cluster":
      return "cluster";
    default:
      return "home";
  }
}

// Returns the bound corresponding to the layer name.
export function getBound(layer: string): MapBound | undefined {
    return mapAttributes.find((attribute) => attribute.name === layer)?.bound;
}

// Format the number based on the unit.
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