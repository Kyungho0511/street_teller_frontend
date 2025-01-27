import { v4 as uuidv4 } from "uuid";
import {
  HealthcareFeatureCollection,
  HealthcarePropertyName,
} from "./geoJsonConstants";
import { color, RGBA, transparentColor } from "./mapConstants";
import { iconPaths } from "./IconConstants";
import { NUMBER_OF_CLUSTERS } from "./kMeansConstants";
import { Survey } from "../context/SurveyContext";
import { KMeansResult } from "ml-kmeans/lib/KMeansResult";
import { CheckboxItem } from "../components/molecules/CheckboxList";

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
  subCategories: HealthcarePropertyName[];
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
        "unserved population / km2",
        "unserved medicaid enrollees / km2",
        "unserved commercial enrollees / km2",
      ],
    },
    {
      category: "Insured Population Density",
      ranking: 2,
      iconPath: iconPaths.insuredPopulation,
      selected: false,
      id: uuidv4(),
      subCategories: [
        "insured population / km2",
        "medicaid enrollees / km2",
        "commercial enrollees / km2",
      ],
    },
    {
      category: "Health Status",
      ranking: 3,
      iconPath: iconPaths.healthStatus,
      selected: false,
      id: uuidv4(),
      subCategories: [
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
        "fair or poor self-rated health status",
      ],
    },
    {
      category: "Income & Expenses",
      ranking: 4,
      iconPath: iconPaths.income,
      selected: false,
      id: uuidv4(),
      subCategories: [
        "average land price / ft2",
        "median household income",
        "median household disposable income",
        "median monthly housing cost",
      ],
    },
    {
      category: "Land Use",
      ranking: 5,
      iconPath: iconPaths.landUse,
      selected: false,
      id: uuidv4(),
      subCategories: [
        "agricultural land percent",
        "residential district percent",
        "commercial district percent",
        "industrial district percent",
        "vacant land percent",
      ],
    },
    {
      category: "Mode of Transportation",
      ranking: 6,
      iconPath: iconPaths.transportation,
      selected: false,
      id: uuidv4(),
      subCategories: [
        "drove alone percent",
        "carpooled percent",
        "public transit percent",
        "walked percent",
        "worked from home percent",
      ],
    },
  ],
};

export const siteCategories = initialPreferenceList.list.map(
  ({ category, subCategories }) => ({
    category,
    subCategories,
  })
);

export const NUMBER_OF_CLUSTERING_STEPS = 3;

export type Centroid = { name: HealthcarePropertyName; value: number };

export type Cluster = CheckboxItem & {
  name: string;
  content: string;
  centroids: Centroid[];
  color: RGBA;
  index: number;
  clusterId: string;
  checked: boolean;
};

export type Report = CheckboxItem & {
  name: string;
  content: string;
  clusters: Cluster[];
  color: RGBA;
  geoIds: string[];
  index: number;
  checked: boolean;
};

export type ClusterList = {
  name: `cluster1` | `cluster2` | `cluster3`;
  list: Cluster[];
  colors: RGBA[];
  geoJson: HealthcareFeatureCollection | undefined;
  attributes: HealthcarePropertyName[];
  kMeansResult: KMeansResult | undefined;
};

export type ReportList = {
  name: "report";
  geoJson: HealthcareFeatureCollection | undefined;
  list: Report[];
  colors: RGBA[];
};

export type ReportSubList = {
  name: string;
  content: string;
  color: RGBA;
}[];

export const initialSurvey: Survey = {
  preference: initialPreferenceList,
  cluster1: createClusterList("1", color.yellow.categorized),
  cluster2: createClusterList("2", color.blue.categorized),
  cluster3: createClusterList("3", color.green.categorized),
  report: {
    name: "report",
    list: [],
    colors: [],
    geoJson: undefined,
  } as ReportList,
};

/**
 * Create a cluster list with default values.
 */
function createClusterList(clusterId: string, colors: RGBA[]): ClusterList {
  const list: Cluster[] = Array.from(
    { length: NUMBER_OF_CLUSTERS },
    (_, i) => ({
      name: "",
      centroids: [
        { name: "walked percent" as HealthcarePropertyName, value: 0 },
      ],
      content: "",
      color: transparentColor,
      checked: true,
      index: i,
      clusterId,
      id: uuidv4(),
    })
  );
  return {
    name: `cluster${clusterId}` as ClusterList["name"],
    list,
    colors,
    geoJson: undefined,
    attributes: [],
    kMeansResult: undefined,
  };
}
