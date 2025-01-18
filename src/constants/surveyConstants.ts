import { v4 as uuidv4 } from "uuid";
import { ListItem } from "../components/molecules/SelectableList";
import { CheckboxItem } from "../components/molecules/CheckboxList";
import { HealthcarePropertyName } from "./geoJsonConstants";
import { defaultColor, RGBA } from "./mapConstants";
import { iconPaths } from "./IconConstants";

/**
 * Site preference categories of the user survey.
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
  iconPath: string;
  selected: boolean;
  id: string;
  subCategories: ListItem[];
};

export type PreferenceList = {
  name: "preferences";
  list: Preference[];
};

export const initialPreferenceList: PreferenceList = {
  name: "preferences",
  list: [
    {
      category: "Unserved Population Density",
      ranking: 1,
      iconPath: iconPaths.unservedPopulation,
      selected: true,
      id: uuidv4(),
      subCategories: [
        { name: "unserved population / km2", id: uuidv4() },
        { name: "unserved medicaid enrollees / km2", id: uuidv4() },
        { name: "unserved commercial enrollees / km2", id: uuidv4() },
      ],
    },
    {
      category: "Insured Population Density",
      ranking: 2,
      iconPath: iconPaths.insuredPopulation,
      selected: false,
      id: uuidv4(),
      subCategories: [
        { name: "insured population / km2", id: uuidv4() },
        { name: "medicaid enrollees / km2", id: uuidv4() },
        { name: "commercial enrollees / km2", id: uuidv4() },
      ],
    },
    {
      category: "Health Status",
      ranking: 3,
      iconPath: iconPaths.healthStatus,
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
      ],
    },
    {
      category: "Income & Expenses",
      ranking: 4,
      iconPath: iconPaths.income,
      selected: false,
      id: uuidv4(),
      subCategories: [
        { name: "average land price / ft2", id: uuidv4() },
        { name: "median household income", id: uuidv4() },
        { name: "median household disposable income", id: uuidv4() },
        { name: "median monthly housing cost", id: uuidv4() },
      ],
    },
    {
      category: "Land Use",
      ranking: 5,
      iconPath: iconPaths.landUse,
      selected: false,
      id: uuidv4(),
      subCategories: [
        { name: "agricultural land percent", id: uuidv4() },
        { name: "residential district percent", id: uuidv4() },
        { name: "commercial district percent", id: uuidv4() },
        { name: "industrial district percent", id: uuidv4() },
        { name: "vacant land percent", id: uuidv4() },
      ],
    },
    {
      category: "Mode of Transportation",
      ranking: 6,
      iconPath: iconPaths.transportation,
      selected: false,
      id: uuidv4(),
      subCategories: [
        { name: "drove alone percent", id: uuidv4() },
        { name: "carpooled percent", id: uuidv4() },
        { name: "public transit percent", id: uuidv4() },
        { name: "walked percent", id: uuidv4() },
        { name: "worked from home percent", id: uuidv4() },
      ],
    },
  ],
};

export const siteCategories = initialPreferenceList.list.map((preference) => ({
  category: preference.category,
  subCategories: preference.subCategories.map(
    (subCategory) => subCategory.name
  ),
}));

/**
 * Borough list of the user survey.
 */
export type BoroughList = {
  name: "boroughs";
  list: CheckboxItem[];
};

/**
 * Borough list to load initially.
 */
export const initialBoroughList: BoroughList = {
  name: "boroughs",
  list: [
    { name: "Manhattan", checked: true, id: uuidv4() },
    { name: "Brooklyn", checked: false, id: uuidv4() },
    { name: "Bronx", checked: false, id: uuidv4() },
    { name: "Queens", checked: false, id: uuidv4() },
    { name: "Staten Island", checked: false, id: uuidv4() },
  ],
};

export type Centroid = { name: HealthcarePropertyName; value: number };

/**
 * Clusters for the survey.
 */
export type Cluster = {
  name: string;
  centroids: Centroid[];
  reasoning: string;
  color: RGBA;
  index: number;
  clusterId: string;
};

export type ClusterCheckboxItem = CheckboxItem & Cluster;

export type ClusterList = {
  name: `cluster${number}`;
  list: ClusterCheckboxItem[];
};

/**
 * Report for a group of clusters.
 */
export type Report = {
  name: string;
  reasoning: string;
  clusters: Cluster[];
  color: RGBA;
  geoIds: string[];
  index: number;
};

export type ReportCheckboxItem = CheckboxItem & Report;

export type ReportList = {
  name: "report";
  list: ReportCheckboxItem[];
};

/**
 * Cluster lists to load initially.
 */
export const initialClusterLists: ClusterList[] = [
  {
    name: "cluster1",
    list: [
      {
        name: "",
        centroids: [{ name: "walked percent", value: 0 }],
        reasoning: "",
        color: defaultColor,
        checked: true,
        index: 0,
        clusterId: "1",
        id: uuidv4(),
      },
      {
        name: "",
        centroids: [{ name: "walked percent", value: 0 }],
        reasoning: "",
        color: defaultColor,
        checked: true,
        index: 1,
        clusterId: "1",
        id: uuidv4(),
      },
      {
        name: "",
        centroids: [{ name: "walked percent", value: 0 }],
        reasoning: "",
        color: defaultColor,
        checked: true,
        index: 2,
        clusterId: "1",
        id: uuidv4(),
      },
      {
        name: "",
        centroids: [{ name: "walked percent", value: 0 }],
        reasoning: "",
        color: defaultColor,
        checked: true,
        index: 3,
        clusterId: "1",
        id: uuidv4(),
      },
    ],
  },
  {
    name: "cluster2",
    list: [
      {
        name: "",
        centroids: [{ name: "walked percent", value: 0 }],
        reasoning: "",
        color: defaultColor,
        checked: true,
        index: 0,
        clusterId: "2",
        id: uuidv4(),
      },
      {
        name: "",
        centroids: [{ name: "walked percent", value: 0 }],
        reasoning: "",
        color: defaultColor,
        checked: true,
        index: 1,
        clusterId: "2",
        id: uuidv4(),
      },
      {
        name: "",
        centroids: [{ name: "walked percent", value: 0 }],
        reasoning: "",
        color: defaultColor,
        checked: true,
        index: 2,
        clusterId: "2",
        id: uuidv4(),
      },
      {
        name: "",
        centroids: [{ name: "walked percent", value: 0 }],
        reasoning: "",
        color: defaultColor,
        checked: true,
        index: 3,
        clusterId: "2",
        id: uuidv4(),
      },
    ],
  },
  {
    name: "cluster3",
    list: [
      {
        name: "",
        centroids: [{ name: "walked percent", value: 0 }],
        reasoning: "",
        color: defaultColor,
        checked: true,
        index: 0,
        clusterId: "3",
        id: uuidv4(),
      },
      {
        name: "",
        centroids: [{ name: "walked percent", value: 0 }],
        reasoning: "",
        color: defaultColor,
        checked: true,
        index: 1,
        clusterId: "3",
        id: uuidv4(),
      },
      {
        name: "",
        centroids: [{ name: "walked percent", value: 0 }],
        reasoning: "",
        color: defaultColor,
        checked: true,
        index: 2,
        clusterId: "3",
        id: uuidv4(),
      },
      {
        name: "",
        centroids: [{ name: "walked percent", value: 0 }],
        reasoning: "",
        color: defaultColor,
        checked: true,
        index: 3,
        clusterId: "3",
        id: uuidv4(),
      },
    ],
  },
];
