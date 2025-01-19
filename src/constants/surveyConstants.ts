import { v4 as uuidv4 } from "uuid";
import { ListItem } from "../components/molecules/SelectableList";
import { HealthcarePropertyName } from "./geoJsonConstants";
import { RGBA } from "./mapConstants";
import { iconPaths } from "./IconConstants";
import { NUMBER_OF_CLUSTERS } from "./kMeansConstants";
import { Survey } from "../context/SurveyContext";
import { sectionMapConfigs } from "./sectionConstants";

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
  name: "preference";
  list: Preference[];
};

export const initialPreferenceList: PreferenceList = {
  name: "preference",
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

export const NUMBER_OF_CLUSTERING_STEPS = 3;

export type Centroid = { name: HealthcarePropertyName; value: number };

export type Cluster = {
  name: string;
  reasoning: string;
  centroids: Centroid[];
  color: RGBA;
  index: number;
  clusterId: string;
};

export type Report = {
  name: string;
  reasoning: string;
  clusters: Cluster[];
  color: RGBA;
  geoIds: string[];
  index: number;
};

export type ClusterCheckboxItem = Cluster & { checked: boolean };

export type ReportCheckboxItem = Report & { checked: boolean };

export type ClusterList = {
  name: `cluster1` | `cluster2` | `cluster3`;
  list: ClusterCheckboxItem[];
};

export type ReportList = {
  name: "report";
  list: ReportCheckboxItem[];
};

export type CheckboxItem = ClusterCheckboxItem | ReportCheckboxItem;

export const initialSurvey: Survey = {
  preference: initialPreferenceList,
  cluster1: createClusterList("1"),
  cluster2: createClusterList("2"),
  cluster3: createClusterList("3"),
  report: {
    name: "report",
    list: [],
  } as ReportList,
};

/**
 * Create a cluster list with default values.
 */
function createClusterList(clusterId: string): ClusterList {
  const list: ClusterCheckboxItem[] = Array.from(
    { length: NUMBER_OF_CLUSTERS },
    (_, i) => ({
      name: "",
      centroids: [
        { name: "walked percent" as HealthcarePropertyName, value: 0 },
      ],
      reasoning: "",
      color: sectionMapConfigs.find(
        (section) => section.id === `cluster${clusterId}`
      )?.color?.categorized[i] as RGBA,
      checked: true,
      index: i,
      clusterId,
      id: uuidv4(),
    })
  );
  return {
    name: `cluster${clusterId}` as "cluster1" | "cluster2" | "cluster3",
    list,
  };
}
