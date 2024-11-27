import * as utils from "../utils/utils";
import { HealthcarePropertyName } from "./geoJsonConstants";
import { Section } from "./surveyConstants";

export type Location = {
  center: mapboxgl.LngLat;
  zoom: number;
  pitch: number;
  bearing: number;
};

export const mapConfigs = {
  style: {
    map: "mapbox://styles/klee0511/cm2hy9ofn00an01pb8q8q8fw8",
    mapSimple: "mapbox://styles/klee0511/cm3zccrck00hq01s05gfkacue",
    satellite: "mapbox://styles/klee0511/cm3nx3g9o00mj01r22uldc1ib",
    satelliteSimple: "mapbox://styles/klee0511/cm3zcek8m00g301qr7x9d80h2",
  },
  location: {
    center: {
      lng: -73.860766,
      lat: 40.713326,
    },
    zoom: 11,
    pitch: 0,
    bearing: 0,
  } as Location,
};

export const GEOID = "GEOID";

export const OUTLINE_LAYER = "tracts-features-nyc-outline";

export const THICK_LINE_WEIGHT = 4;

export const ZOOM_MODIFIER = 3; // zoom level modifier for map preview.

export const POPUP = {
  width: 250,
  height: 180,
  offset: 30,
};

export const transparent = "rgba(255,255,255,0)";

export type Hex = `#${string}`;

export type RGBA = `rgba(${number},${number},${number},${number})`;

export type Color = {
  categorized: RGBA[];
  min: RGBA;
  max: RGBA;
};

export type FillColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};
const opacity = 0.8;
export const color: { [key in string]: Color } = {
  blue: {
    categorized: [
      `rgba(179,232,235,${opacity})`,
      `rgba(99,193,231,${opacity})`,
      `rgba(32,157,234,${opacity})`,
      `rgba(80,122,236,${opacity})`,
    ],
    min: `rgba(247,250,255,${opacity})`,
    max: `rgba(0,110,254,${opacity})`,
  },
  yellow: {
    categorized: [
      `rgba(247,233,0,${opacity})`,
      `rgba(255,200,0,${opacity})`,
      `rgba(244,137,75,${opacity})`,
      `rgba(226,102,102,${opacity})`,
    ],
    min: `rgba(255,250,236,${opacity})`,
    max: `rgba(249,162,0,${opacity})`,
  },
  green: {
    categorized: [
      `rgba(216,227,115,${opacity})`,
      `rgba(178,226,120,${opacity})`,
      `rgba(102,205,90,${opacity})`,
      `rgba(93,182,190,${opacity})`,
    ],
    min: `rgba(227,209,173,${opacity})`,
    max: `rgba(42,169,181,${opacity})`,
  },
};

export type UnitType =
  | "population density"
  | "percentage"
  | "percentage * 100"
  | "dollar"
  | "dollar * 50";

export type MapLayer = {
  name: string;
  opacity: number;
};

export type MapBound = {
  min: number;
  max: number;
  rateOfChange: ["exponential", number] | ["linear"];
};

export type MapAttribute = {
  name: HealthcarePropertyName;
  bound: MapBound;
  unit: UnitType;
};

export const mapAttributes: MapAttribute[] = [
  {
    name: "medicaid enrollees / km2",
    bound: {
      min: 48.19,
      max: 55472.48,
      rateOfChange: ["exponential", 0.99995],
    },
    unit: "population density",
  },
  {
    name: "commercial enrollees / km2",
    bound: {
      min: 214.31,
      max: 42294.7,
      rateOfChange: ["exponential", 0.99995],
    },
    unit: "population density",
  },
  {
    name: "insured population / km2",
    bound: { min: 316.5, max: 76410.9, rateOfChange: ["exponential", 0.99995] },
    unit: "population density",
  },
  {
    name: "unserved population / km2",
    bound: { min: 12.7, max: 45610.7, rateOfChange: ["exponential", 0.99995] },
    unit: "population density",
  },
  {
    name: "unserved medicaid enrollees / km2",
    bound: { min: 0.0, max: 45610.7, rateOfChange: ["exponential", 0.99995] },
    unit: "population density",
  },
  {
    name: "unserved commercial enrollees / km2",
    bound: { min: 0.0, max: 12665.9, rateOfChange: ["exponential", 0.99995] },
    unit: "population density",
  },
  {
    name: "average land price / ft2",
    bound: { min: 2.67, max: 34.29, rateOfChange: ["linear"] },
    unit: "dollar * 50",
  },
  {
    name: "agricultural land percent",
    bound: { min: 0.0, max: 0.1, rateOfChange: ["linear"] },
    unit: "percentage * 100",
  },
  {
    name: "residential district percent",
    bound: { min: 0.08, max: 1.0, rateOfChange: ["linear"] },
    unit: "percentage * 100",
  },
  {
    name: "vacant land percent",
    bound: { min: 0.0, max: 0.53, rateOfChange: ["linear"] },
    unit: "percentage * 100",
  },
  {
    name: "commercial district percent",
    bound: { min: 0.0, max: 0.48, rateOfChange: ["linear"] },
    unit: "percentage * 100",
  },
  {
    name: "industrial district percent",
    bound: { min: 0.0, max: 0.08, rateOfChange: ["linear"] },
    unit: "percentage * 100",
  },
  {
    name: "drove alone percent",
    bound: { min: 0.01, max: 0.72, rateOfChange: ["linear"] },
    unit: "percentage * 100",
  },
  {
    name: "carpooled percent",
    bound: { min: 0.0, max: 0.28, rateOfChange: ["linear"] },
    unit: "percentage * 100",
  },
  {
    name: "public transit percent",
    bound: { min: 0.09, max: 0.94, rateOfChange: ["linear"] },
    unit: "percentage * 100",
  },
  {
    name: "walked percent",
    bound: { min: 0.0, max: 0.58, rateOfChange: ["linear"] },
    unit: "percentage * 100",
  },
  {
    name: "worked from home percent",
    bound: { min: 0.0, max: 0.34, rateOfChange: ["linear"] },
    unit: "percentage * 100",
  },
  {
    name: "no leisure-time physical activity",
    bound: { min: 17.5, max: 51.2, rateOfChange: ["linear"] },
    unit: "percentage",
  },
  {
    name: "binge drinking",
    bound: { min: 8.8, max: 22.2, rateOfChange: ["linear"] },
    unit: "percentage",
  },
  {
    name: "sleeping less than 7 hours",
    bound: { min: 28.4, max: 46.8, rateOfChange: ["linear"] },
    unit: "percentage",
  },
  {
    name: "current smoking",
    bound: { min: 7.9, max: 30.1, rateOfChange: ["linear"] },
    unit: "percentage",
  },
  {
    name: "cholesterol screening",
    bound: { min: 70.6, max: 92.9, rateOfChange: ["linear"] },
    unit: "percentage",
  },
  {
    name: "current lack of health insurance",
    bound: { min: 4.1, max: 30.4, rateOfChange: ["linear"] },
    unit: "percentage",
  },
  {
    name: "taking medicine for high blood pressure",
    bound: { min: 57.2, max: 86.8, rateOfChange: ["linear"] },
    unit: "percentage",
  },
  {
    name: "visits to dentist or dental clinic",
    bound: { min: 34.6, max: 77.2, rateOfChange: ["linear"] },
    unit: "percentage",
  },
  {
    name: "visits to doctor for routine checkup",
    bound: { min: 67.4, max: 85.6, rateOfChange: ["linear"] },
    unit: "percentage",
  },
  {
    name: "physical health not good for >=14 days",
    bound: { min: 7.0, max: 21.7, rateOfChange: ["linear"] },
    unit: "percentage",
  },
  {
    name: "mental health not good for >=14 days",
    bound: { min: 10.4, max: 27.7, rateOfChange: ["linear"] },
    unit: "percentage",
  },
  {
    name: "fair or poor self-rated health status",
    bound: { min: 9.4, max: 39.1, rateOfChange: ["linear"] },
    unit: "percentage",
  },
  {
    name: "median household income",
    bound: { min: 17083.0, max: 191083.0, rateOfChange: ["linear"] },
    unit: "dollar",
  },
  {
    name: "median household disposable income",
    bound: { min: 3107.0, max: 150067.0, rateOfChange: ["linear"] },
    unit: "dollar",
  },
  {
    name: "median monthly housing cost",
    bound: { min: 388.0, max: 3418.0, rateOfChange: ["linear"] },
    unit: "dollar",
  },
];

export type MapSection = {
  id: Section;
  layers: MapLayer[];
  // Parent layer containing attributes
  parentLayer: string;
  // Attribute in parent layer to be visualized.
  attribute?: MapAttribute;
  // Color for attributes
  color?: Color;
};

export const mapSections: MapSection[] = [
  {
    id: "home",
    layers: [
      { name: "tracts", opacity: 0.9 },
      { name: "tracts-features-nyc", opacity: 1 },
    ],
    attribute: {
      name: "unserved population / km2",
      bound: utils.getBound("unserved population / km2")!,
      unit: "population density",
    },
    parentLayer: "tracts-features-nyc",
    color: color.blue,
  },
  {
    id: "cluster1",
    layers: [{ name: "tracts", opacity: 0.9 }],
    parentLayer: "cluster1",
    color: color.yellow,
  },
  {
    id: "cluster2",
    layers: [{ name: "tracts", opacity: 0.9 }],
    parentLayer: "cluster2",
    color: color.blue,
  },
  {
    id: "cluster3",
    layers: [{ name: "tracts", opacity: 0.9 }],
    parentLayer: "cluster3",
    color: color.green,
  },
];
