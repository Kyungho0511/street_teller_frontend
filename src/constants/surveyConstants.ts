import { v4 as uuidv4 } from 'uuid';
import {
  faMoneyCheckDollar,
  faPeopleGroup,
  faPersonWalking,
  faHospitalUser,
  faGraduationCap,
  faStore,
  faTree,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { ListItem } from '../components/SelectableList';
import { CheckboxItem } from '../components/CheckboxList';

export type Section = "home" | "cluster";

/**
 * Preference categories for the survey.
 */
export type SiteCategory =
  | "Unserved Population Density"
  | "Insured Population Density"
  | "Health Status"
  | "Income & Expenses"
  | "Land Use"
  | "Mode of Transportation";

export type Preference = {
  category: SiteCategory;
  ranking: number;
  icon: IconDefinition;
  selected: boolean;
  id: string;
  subCategories: ListItem[];
};

export type PreferenceList = {
  name: "preferences";
  list: Preference[];
};

export const initialPreferences: Preference[] = [
  {
    category: "Unserved Population Density",
    ranking: 1,
    icon: faMoneyCheckDollar,
    selected: true,
    id: uuidv4(),
    subCategories: [
      { name: "unserved population / km2", id: uuidv4() },
      { name: "unserved medicaid enrollees / km2", id: uuidv4() },
      { name: "unserved commercial enrollees / km2", id: uuidv4() },
    ]
  },
  {
    category: "Insured Population Density",
    ranking: 2,
    icon: faPeopleGroup,
    selected: false,
    id: uuidv4(),
    subCategories: [
      { name: "insured population / km2", id: uuidv4() },
      { name: "medicaid enrollees / km2", id: uuidv4() },
      { name: "commercial enrollees / km2", id: uuidv4() },
    ]
  },
  {
    category: "Health Status",
    ranking: 3,
    icon: faPersonWalking,
    selected: false,
    id: uuidv4(),
    subCategories: [
      { name: "no leisure-time physical activity", id: uuidv4() },
      { name: "binge drinking", id: uuidv4() },
      { name: "sleeping less than 7 hours", id: uuidv4() },
      { name: "current smoking", id: uuidv4() },
      { name: "cholesterol screening", id: uuidv4() },
      { name: "current lack of health insurance", id: uuidv4() },
      { name: "taking medicine for high blood pressure", id: uuidv4() },
      { name: "visits to dentist or dental clinic", id: uuidv4() },
      { name: "visits to doctor for routine checkup", id: uuidv4() },
      { name: "physical health not good for >=14 days", id: uuidv4() },
      { name: "mental health not good for >=14 days", id: uuidv4() },
      { name: "fair or poor self-rated health status", id: uuidv4() },
    ]
  },
  {
    category: "Income & Expenses",
    ranking: 4,
    icon: faHospitalUser,
    selected: false,
    id: uuidv4(),
    subCategories: [
      {name: "average land price / ft2", id: uuidv4()},
      {name: "median household income", id: uuidv4()},
      {name: "median household disposable income", id: uuidv4()},
      {name: "median monthly housing cost", id: uuidv4()},
    ]
  },
  {
    category: "Land Use",
    ranking: 5,
    icon: faGraduationCap,
    selected: false,
    id: uuidv4(),
    subCategories: [
      {name: "agricultural land percent", id: uuidv4()},
      {name: "residential district percent", id: uuidv4()},
      {name: "commercial district percent", id: uuidv4()},
      {name: "industrial district percent", id: uuidv4()},
      {name: "vacant land percent", id: uuidv4()},
    ]
  },
  {
    category: "Mode of Transportation",
    ranking: 6,
    icon: faStore,
    selected: false,
    id: uuidv4(),
    subCategories: [
      {name: "drove alone percent", id: uuidv4()},
      {name: "carpooled percent", id: uuidv4()},
      {name: "public transit percent", id: uuidv4()},
      {name: "walked percent", id: uuidv4()},
      {name: "worked from home percent", id: uuidv4()},
    ]
  },
];


/**
 * Boroughs for the survey.
 */
export type BoroughList = {
  name: "boroughs";
  list: CheckboxItem[];
};

export const initialBoroughs: CheckboxItem[] = [
  { name: "Manhattan", checked: true, id: uuidv4() },
  { name: "Brooklyn", checked: false, id: uuidv4() },
  { name: "Bronx", checked: false, id: uuidv4() },
  { name: "Queens", checked: false, id: uuidv4() },
  { name: "Staten Island", checked: false, id: uuidv4() },
];


/**
 * Clusters for the survey.
 */
// Number of preferences to be used for each clustering analysis.
export const clusteringSize = 2;

export type Cluster = {
  name: string; // cluster label name
  values: Record<string, number>; // kmeans center values
};

export type ClusterCheckboxItem = CheckboxItem & Cluster;

export type ClusterList = {
  name: "clusterList";
  list: ClusterCheckboxItem[];
};

// Cluster center values for Testing!!!!!!!!!
export const clusterLists: ClusterList[] = [
  {
    name: "clusterList",
    list: [
      {
        name: "cluster1",
        values: {
          "physical health not good for >=14 days": 0.172175392,
          "mental health not good for >=14 days": 0.202563458,
          "no leisure-time physical activity": 0.195023223,
          "binge drinking": 0.578926022,
          "sleeping less than 7 hours": 0.254194234,
          "current smoking": 0.190094986,
          "current lack of health insurance": 0.115390974,
          "visits to dentist or dental clinic": 0.730251072,
          "visits to doctor for routine checkup": 0.515289059,
          "unserved medicaid enrollees / km2": 0.0476632056,
        },
        checked: true,
        id: uuidv4(),
      },
      {
        name: "cluster2",
        values: {
          "physical health not good for >=14 days": 0.24023542,
          "mental health not good for >=14 days": 0.28706891,
          "no leisure-time physical activity": 0.332894342,
          "binge drinking": 0.430991112,
          "sleeping less than 7 hours": 0.708170493,
          "current smoking": 0.270725782,
          "current lack of health insurance": 0.15446234,
          "visits to dentist or dental clinic": 0.584269663,
          "visits to doctor for routine checkup": 0.776916903,
          "unserved medicaid enrollees / km2": 0.0615815607,
        },
        checked: true,
        id: uuidv4(),
      },
      {
        name: "cluster3",
        values: {
          "physical health not good for >=14 days": 0.573639456,
          "mental health not good for >=14 days": 0.560308285,
          "no leisure-time physical activity": 0.676582591,
          "binge drinking": 0.367039801,
          "sleeping less than 7 hours": 0.629664855,
          "current smoking": 0.575337838,
          "current lack of health insurance": 0.562040558,
          "visits to dentist or dental clinic": 0.259663537,
          "visits to doctor for routine checkup": 0.49514652,
          "unserved medicaid enrollees / km2": 0.254005292,
        },
        checked: true,
        id: uuidv4(),
      },
      {
        name: "cluster4",
        values: {
          "physical health not good for >=14 days": 0.306538942,
          "mental health not good for >=14 days": 0.341659785,
          "no leisure-time physical activity": 0.434415309,
          "binge drinking": 0.514696924,
          "sleeping less than 7 hours": 0.424245785,
          "current smoking": 0.331770546,
          "current lack of health insurance": 0.364766819,
          "visits to dentist or dental clinic": 0.466094184,
          "visits to doctor for routine checkup": 0.408051133,
          "unserved medicaid enrollees / km2": 0.14429812,
        },
        checked: true,
        id: uuidv4(),
      },
    ]
  },
  {
    name: "clusterList",
    list: [
      {
        name: "cluster1",
        values: {
          "physical health not good for >=14 days": 0.172175392,
          "mental health not good for >=14 days": 0.202563458,
          "no leisure-time physical activity": 0.195023223,
          "binge drinking": 0.578926022,
          "sleeping less than 7 hours": 0.254194234,
          "current smoking": 0.190094986,
          "current lack of health insurance": 0.115390974,
          "visits to dentist or dental clinic": 0.730251072,
          "visits to doctor for routine checkup": 0.515289059,
          "unserved medicaid enrollees / km2": 0.0476632056,
        },
        checked: true,
        id: uuidv4(),
      },
      {
        name: "cluster2",
        values: {
          "physical health not good for >=14 days": 0.24023542,
          "mental health not good for >=14 days": 0.28706891,
          "no leisure-time physical activity": 0.332894342,
          "binge drinking": 0.430991112,
          "sleeping less than 7 hours": 0.708170493,
          "current smoking": 0.270725782,
          "current lack of health insurance": 0.15446234,
          "visits to dentist or dental clinic": 0.584269663,
          "visits to doctor for routine checkup": 0.776916903,
          "unserved medicaid enrollees / km2": 0.0615815607,
        },
        checked: true,
        id: uuidv4(),
      },
      {
        name: "cluster3",
        values: {
          "physical health not good for >=14 days": 0.573639456,
          "mental health not good for >=14 days": 0.560308285,
          "no leisure-time physical activity": 0.676582591,
          "binge drinking": 0.367039801,
          "sleeping less than 7 hours": 0.629664855,
          "current smoking": 0.575337838,
          "current lack of health insurance": 0.562040558,
          "visits to dentist or dental clinic": 0.259663537,
          "visits to doctor for routine checkup": 0.49514652,
          "unserved medicaid enrollees / km2": 0.254005292,
        },
        checked: true,
        id: uuidv4(),
      },
      {
        name: "cluster4",
        values: {
          "physical health not good for >=14 days": 0.306538942,
          "mental health not good for >=14 days": 0.341659785,
          "no leisure-time physical activity": 0.434415309,
          "binge drinking": 0.514696924,
          "sleeping less than 7 hours": 0.424245785,
          "current smoking": 0.331770546,
          "current lack of health insurance": 0.364766819,
          "visits to dentist or dental clinic": 0.466094184,
          "visits to doctor for routine checkup": 0.408051133,
          "unserved medicaid enrollees / km2": 0.14429812,
        },
        checked: true,
        id: uuidv4(),
      },
    ]
  },
  {
    name: "clusterList",
    list: [
      {
        name: "cluster1",
        values: {
          "physical health not good for >=14 days": 0.172175392,
          "mental health not good for >=14 days": 0.202563458,
          "no leisure-time physical activity": 0.195023223,
          "binge drinking": 0.578926022,
          "sleeping less than 7 hours": 0.254194234,
          "current smoking": 0.190094986,
          "current lack of health insurance": 0.115390974,
          "visits to dentist or dental clinic": 0.730251072,
          "visits to doctor for routine checkup": 0.515289059,
          "unserved medicaid enrollees / km2": 0.0476632056,
        },
        checked: true,
        id: uuidv4(),
      },
      {
        name: "cluster2",
        values: {
          "physical health not good for >=14 days": 0.24023542,
          "mental health not good for >=14 days": 0.28706891,
          "no leisure-time physical activity": 0.332894342,
          "binge drinking": 0.430991112,
          "sleeping less than 7 hours": 0.708170493,
          "current smoking": 0.270725782,
          "current lack of health insurance": 0.15446234,
          "visits to dentist or dental clinic": 0.584269663,
          "visits to doctor for routine checkup": 0.776916903,
          "unserved medicaid enrollees / km2": 0.0615815607,
        },
        checked: true,
        id: uuidv4(),
      },
      {
        name: "cluster3",
        values: {
          "physical health not good for >=14 days": 0.573639456,
          "mental health not good for >=14 days": 0.560308285,
          "no leisure-time physical activity": 0.676582591,
          "binge drinking": 0.367039801,
          "sleeping less than 7 hours": 0.629664855,
          "current smoking": 0.575337838,
          "current lack of health insurance": 0.562040558,
          "visits to dentist or dental clinic": 0.259663537,
          "visits to doctor for routine checkup": 0.49514652,
          "unserved medicaid enrollees / km2": 0.254005292,
        },
        checked: true,
        id: uuidv4(),
      },
      {
        name: "cluster4",
        values: {
          "physical health not good for >=14 days": 0.306538942,
          "mental health not good for >=14 days": 0.341659785,
          "no leisure-time physical activity": 0.434415309,
          "binge drinking": 0.514696924,
          "sleeping less than 7 hours": 0.424245785,
          "current smoking": 0.331770546,
          "current lack of health insurance": 0.364766819,
          "visits to dentist or dental clinic": 0.466094184,
          "visits to doctor for routine checkup": 0.408051133,
          "unserved medicaid enrollees / km2": 0.14429812,
        },
        checked: true,
        id: uuidv4(),
      },
    ]
  }
]
