import CheckboxList, { CheckboxItem } from "../components/CheckboxList";
import { DropdownListType } from "../components/DropdownList";
import DropdownManager from "../components/DropdownManager";
import Sidebar from "../components/Sidebar";
import SidebarSection from "../components/SidebarSection";

export default function Cluster() {
  return (
    <Sidebar>
      <SidebarSection title="Custom Clusters">
        <p>
          Add or remove features to customize your clustering analysis. Click
          the 'Cluster' button when you are ready.
        </p>
        <DropdownManager lists={vulnerabilityLists} />
      </SidebarSection>

      <SidebarSection title="Filter Target Clusters">
        <p>
          Review the subcategory values for each cluster in the legend. Exclude
          the clusters you're not targeting, and continue.
        </p>
        <CheckboxList name="select1" list={targetClusters} />
      </SidebarSection>
    </Sidebar>
  );
}

const targetClusters: CheckboxItem[] = [
  {
    text: "Cluster 1",
    value: "0",
  },
  {
    text: "Cluster 2",
    value: "1",
  },
  {
    text: "Cluster 3",
    value: "2",
  },
  {
    text: "Cluster 4",
    value: "3",
  },
];


const vulnerabilityLists: DropdownListType[] = [
  {
    category: "Features to Cluster",
    items: [
      "physical health not good for >=14 days",
      "mental health not good for >=14 days",
      "no leisure-time physical activity",
      "binge drinking",
      "sleeping less than 7 hours",
      "current smoking",
      "current lack of health insurance",
      "visits to dentist or dental clinic",
      "visits to doctor for routine checkup",
    ],
  },
  {
    category: "Features to Add",
    items: [],
  }
]; 

const profitabilityLists: DropdownListType[] = [
  {
    category: "Features to Cluster",
    items: [
      "unserved medicaid enrollees / km2",
      "unserved commercial enrollees / km2",
      "insured population / km2",
      "median household disposable income",
      "average land price / ft2",
    ],
  },
  {
    category: "Features to Add",
    items: [""],
  }
];

const builtEnvironmentLists: DropdownListType[] = [
  {
    category: "Features to Cluster",
    items: [
      "commercial district percent",
      "residential district percent",
      "industrial district percent",
      "agricultural land percent",
      "vacant land percent",
      "drove alone percent",
      "public transit percent",
      "walked percent",
      "worked from home percent",
    ],
  },
  {
    category: "Features to Add",
    items: [""],
  }
];