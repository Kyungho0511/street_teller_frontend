import { FeatureCollection, Polygon } from 'geojson';

type HealthcareProperties = {
  "GEOID": string;
  "medicaid enrollees / km2": number;
  "commercial enrollees / km2": number;
  "insured population / km2": number;
  "unserved medicaid enrollees / km2": number;
  "unserved commercial enrollees / km2": number;
  "average land price / ft2": number;
  "agricultural land percent": number;
  "residential district percent": number;
  "vacant land percent": number;
  "commercial district percent": number;
  "industrial district percent": number;
  "residential area / ft2": number;
  "commercial area / ft2": number;
  "drove alone percent": number;
  "carpooled percent": number;
  "public transit percent": number;
  "walked percent": number;
  "worked from home percent": number;
  "no leisure-time physical activity": number;
  "binge drinking": number;
  "sleeping less than 7 hours": number;
  "current smoking": number;
  "cholesterol screening": number;
  "current lack of health insurance": number;
  "taking medicine for high blood pressure": number;
  "visits to dentist or dental clinic": number;
  "visits to doctor for routine checkup": number;
  "physical health not good for >=14 days": number;
  "mental health not good for >=14 days": number;
  "fair or poor self-rated health status": number;
  "median household income": number;
  "median household disposable income": number;
  "median monthly housing cost": number;
  "unserved population / km2": number;
}

export type HealthcareFeatureCollection = FeatureCollection<Polygon, HealthcareProperties>;