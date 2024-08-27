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