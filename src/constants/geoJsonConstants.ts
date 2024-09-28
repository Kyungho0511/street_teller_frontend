import { Feature, FeatureCollection, Polygon } from 'geojson';

export const geoJsonFilePath = "/data/tracts_features_nyc_normalized.geojson";

export type HealthcarePropertyName =
  | "GEOID"
  | "cluster"
  | "medicaid enrollees / km2"
  | "commercial enrollees / km2"
  | "insured population / km2"
  | "unserved medicaid enrollees / km2"
  | "unserved commercial enrollees / km2"
  | "average land price / ft2"
  | "agricultural land percent"
  | "residential district percent"
  | "vacant land percent"
  | "commercial district percent"
  | "industrial district percent"
  | "residential area / ft2"
  | "commercial area / ft2"
  | "drove alone percent"
  | "carpooled percent"
  | "public transit percent"
  | "walked percent"
  | "worked from home percent"
  | "no leisure-time physical activity"
  | "binge drinking"
  | "sleeping less than 7 hours"
  | "current smoking"
  | "cholesterol screening"
  | "current lack of health insurance"
  | "taking medicine for high blood pressure"
  | "visits to dentist or dental clinic"
  | "visits to doctor for routine checkup"
  | "physical health not good for >=14 days"
  | "mental health not good for >=14 days"
  | "fair or poor self-rated health status"
  | "median household income"
  | "median household disposable income"
  | "median monthly housing cost"
  | "unserved population / km2";

export type HealthcareProperties = {
  [key in HealthcarePropertyName]: number;
}

export type HealthcareFeature = Feature<Polygon, HealthcareProperties>;

export type HealthcareFeatureCollection = FeatureCollection<Polygon, HealthcareProperties>;