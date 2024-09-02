import { Section } from "./../services/navigate";

export const configs = {
  style: "mapbox://styles/klee0511/clv0xyqe0016v01pe0ogo6xre",
  location: {
    center: [-73.860766, 40.713326],
    zoom: 11,
    pitch: 0,
    bearing: 0,
  },
};

type Hex = `#${string}`;

export type Color = {
  categorized: Hex[];
  min: Hex;
  max: Hex;
};

const color: { [key in string]: Color } = {
  blue: {
    categorized: ["#cdecd0", "#7ed7dd", "#2b9ded", "#0f4bee"],
    min: "#f7faff",
    max: "#006efe",
  },
  yellow: {
    categorized: ["#d7e317", "#f7e900", "#f9b91b", "#eb6200"],
    min: "#fffaec",
    max: "#f9a200",
  },
  green: {
    categorized: ["#e3d1ad", "#cedd7e", "#66cd5a", "#2aa9b5"],
    min: "#e3d1ad",
    max: "#2aa9b5",
  },
};

export type LayerBound = {
  name: string;
  min: number;
  max: number;
  rateOfChange: ["exponential", number] | ["linear"];
};

export const layerBounds: LayerBound[] = [
  {
    name: "medicaid enrollees / km2",
    min: 48.19,
    max: 55472.48,
    rateOfChange: ["exponential", 0.99995],
  },
  {
    name: "commercial enrollees / km2",
    min: 214.31,
    max: 42294.7,
    rateOfChange: ["exponential", 0.99995],
  },
  {
    name: "insured population / km2",
    min: 316.5,
    max: 76410.9,
    rateOfChange: ["exponential", 0.99995],
  },
  {
    name: "unserved population / km2",
    min: 12.7,
    max: 45610.7,
    rateOfChange: ["exponential", 0.99995],
  },
  {
    name: "unserved medicaid enrollees / km2",
    min: 0.0,
    max: 45610.7,
    rateOfChange: ["exponential", 0.99995],
  },
  {
    name: "unserved commercial enrollees / km2",
    min: 0.0,
    max: 12665.9,
    rateOfChange: ["exponential", 0.99995],
  },
  {
    name: "average land price / ft2",
    min: 2.67,
    max: 34.29,
    rateOfChange: ["linear"],
  },
  {
    name: "agricultural land percent",
    min: 0.0,
    max: 0.1,
    rateOfChange: ["linear"],
  },
  {
    name: "residential district percent",
    min: 0.08,
    max: 1.0,
    rateOfChange: ["linear"],
  },
  {
    name: "vacant land percent",
    min: 0.0,
    max: 0.53,
    rateOfChange: ["linear"],
  },
  {
    name: "commercial district percent",
    min: 0.0,
    max: 0.48,
    rateOfChange: ["linear"],
  },
  {
    name: "industrial district percent",
    min: 0.0,
    max: 0.08,
    rateOfChange: ["linear"],
  },
  {
    name: "drove alone percent",
    min: 0.01,
    max: 0.72,
    rateOfChange: ["linear"],
  },
  { name: "carpooled percent", min: 0.0, max: 0.28, rateOfChange: ["linear"] },
  {
    name: "public transit percent",
    min: 0.09,
    max: 0.94,
    rateOfChange: ["linear"],
  },
  { name: "walked percent", min: 0.0, max: 0.58, rateOfChange: ["linear"] },
  {
    name: "worked from home percent",
    min: 0.0,
    max: 0.34,
    rateOfChange: ["linear"],
  },
  {
    name: "no leisure-time physical activity",
    min: 17.5,
    max: 51.2,
    rateOfChange: ["linear"],
  },
  { name: "binge drinking", min: 8.8, max: 22.2, rateOfChange: ["linear"] },
  {
    name: "sleeping less than 7 hours",
    min: 28.4,
    max: 46.8,
    rateOfChange: ["linear"],
  },
  { name: "current smoking", min: 7.9, max: 30.1, rateOfChange: ["linear"] },
  {
    name: "cholesterol screening",
    min: 70.6,
    max: 92.9,
    rateOfChange: ["linear"],
  },
  {
    name: "current lack of health insurance",
    min: 4.1,
    max: 30.4,
    rateOfChange: ["linear"],
  },
  {
    name: "taking medicine for high blood pressure",
    min: 57.2,
    max: 86.8,
    rateOfChange: ["linear"],
  },
  {
    name: "visits to dentist or dental clinic",
    min: 34.6,
    max: 77.2,
    rateOfChange: ["linear"],
  },
  {
    name: "visits to doctor for routine checkup",
    min: 67.4,
    max: 85.6,
    rateOfChange: ["linear"],
  },
  {
    name: "physical health not good for >=14 days",
    min: 7.0,
    max: 21.7,
    rateOfChange: ["linear"],
  },
  {
    name: "mental health not good for >=14 days",
    min: 10.4,
    max: 27.7,
    rateOfChange: ["linear"],
  },
  {
    name: "fair or poor self-rated health status",
    min: 9.4,
    max: 39.1,
    rateOfChange: ["linear"],
  },
  {
    name: "median household income",
    min: 17083.0,
    max: 191083.0,
    rateOfChange: ["linear"],
  },
  {
    name: "median household disposable income",
    min: 3107.0,
    max: 150067.0,
    rateOfChange: ["linear"],
  },
  {
    name: "median monthly housing cost",
    min: 388.0,
    max: 3418.0,
    rateOfChange: ["linear"],
  },
];

export type MapLayer = {
  name: string;
  opacity: number;
};

export type MapSection = {
  id: Section;
  layers: MapLayer[];
  // Attribute in parent layer to be visualized.
  attribute?: { name: string; color: Color; bound: LayerBound; parent: string };
};

export const sections: MapSection[] = [
  {
    id: "home",
    layers: [
      { name: "tracts", opacity: 0.9 },
      { name: "tracts-features-nyc", opacity: 1 },
    ],
    attribute: {
      name: "unserved population / km2",
      color: color.yellow,
      bound: layerBounds.find((bound) => bound.name === "unserved population / km2")!,
      parent: "tracts-features-nyc",
    },
  },
  {
    id: "cluster",
    layers: [
      { name: "tracts", opacity: 0.9 },
      { name: "tracts-features-nyc", opacity: 1 },
    ],
  },
];