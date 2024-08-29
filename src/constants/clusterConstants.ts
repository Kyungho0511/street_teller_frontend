import { Message } from '../context/MessageContext';
import { CheckboxItem } from './../components/CheckboxList';
import { DropdownListType } from './../components/DropdownList';
import { v4 as uuidv4 } from 'uuid';

/**
 * Type definitions for the Cluster page.
 */
export const targetClusters: CheckboxItem[] = [
  {
    name: "Cluster 1",
    checked: true,
    id: uuidv4(),
  },
  {
    name: "Cluster 2",
    checked: true,
    id: uuidv4(),
  },
  {
    name: "Cluster 3",
    checked: true,
    id: uuidv4(),
  },
  {
    name: "Cluster 4",
    checked: true,
    id: uuidv4(),
  },
];

export const vulnerabilityLists: DropdownListType[] = [
  {
    category: "Features to Cluster",
    items: [
      {name: "physical health not good for >=14 days", id: uuidv4()},
      {name: "mental health not good for >=14 days", id: uuidv4()},
      {name: "no leisure-time physical activity", id: uuidv4()},
      {name: "binge drinking", id: uuidv4()},
      {name: "sleeping less than 7 hours", id: uuidv4()},
      {name: "current smoking", id: uuidv4()},
      {name: "current lack of health insurance", id: uuidv4()},
      {name: "visits to dentist or dental clinic", id: uuidv4()},
      {name: "visits to doctor for routine checkup", id: uuidv4()},
    ],
    id: uuidv4(),
  },
  {
    category: "Features to Add",
    items: [],
    id: uuidv4(),
  }
]; 

export const profitabilityLists: DropdownListType[] = [
  {
    category: "Features to Cluster",
    items: [
      {name: "unserved medicaid enrollees / km2", id: uuidv4()},
      {name: "unserved commercial enrollees / km2", id: uuidv4()},
      {name: "insured population / km2", id: uuidv4()},
      {name: "median household disposable income", id: uuidv4()},
      {name: "average land price / ft2", id: uuidv4()},
    ],
    id: uuidv4(),
  },
  {
    category: "Features to Add",
    items: [],
    id: uuidv4(),
  }
];

export const builtEnvironmentLists: DropdownListType[] = [
  {
    category: "Features to Cluster",
    items: [
      {name: "commercial district percent", id: uuidv4()},
      {name: "residential district percent", id: uuidv4()},
      {name: "industrial district percent", id: uuidv4()},
      {name: "agricultural land percent", id: uuidv4()},
      {name: "vacant land percent", id: uuidv4()},
      {name: "drove alone percent", id: uuidv4()},
      {name: "public transit percent", id: uuidv4()},
      {name: "walked percent", id: uuidv4()},
      {name: "worked from home percent", id: uuidv4()},
    ],
    id: uuidv4(),
  },
  {
    category: "Features to Add",
    items: [],
    id: uuidv4(),
  }
];

// Initial text for the response box.
export const initialTextCluster: Message = {
  user: "",
  ai: "Add or remove features to customize your clustering analysis. Click the 'Cluster' button when you are ready. Review the subcategory values for each cluster in the legend. Exclude the clusters you're not targeting, and continue.",
};


// Cluster type for kmeans center values
export type Cluster = {
  label: string;
  values: Record<string, number>;
};

// Cluster center values for Testing!!!!!!!!!
export const clusters: Cluster[] = [
  {
    label: "cluster1",
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
  },
  {
    label: "cluster2",
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
  },
  {
    label: "cluster3",
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
  },
  {
    label: "cluster4",
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
  },
];