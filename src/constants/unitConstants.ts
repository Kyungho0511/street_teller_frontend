/**
 * Unit types are used to adjust scales and units in legend
 */
export type UnitPopulationDensity = [
  "medicaid enrollees / km2",
  "commercial enrollees / km2",
  "insured population / km2",
  "unserved medicaid enrollees / km2",
  "unserved commercial enrollees / km2",
  "unserved population / km2"
];
export type UnitHealthSurvey = [
  "no leisure-time physical activity",
  "binge drinking",
  "sleeping less than 7 hours",
  "current smoking",
  "cholesterol screening",
  "current lack of health insurance",
  "taking medicine for high blood pressure",
  "visits to dentist or dental clinic",
  "visits to doctor for routine checkup",
  "physical health not good for >=14 days",
  "mental health not good for >=14 days",
  "fair or poor self-rated health status"
];
export type UnitDollar = [
  "average land price / ft2",
  "median household income",
  "median household disposable income",
  "median monthly housing cost"
];
export type UnitLandUse = [
  "agricultural land percent",
  "residential district percent",
  "commercial district percent",
  "industrial district percent",
  "vacant land percent"
];
export type UnitTransportation = [
  "drove alone percent",
  "carpooled percent",
  "public transit percent",
  "walked percent",
  "worked from home percent"
];