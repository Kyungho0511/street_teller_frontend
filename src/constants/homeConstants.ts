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

export type BoroughList = {
  name: "boroughs";
  list: CheckboxItem[];
};

// Initial values for the survey context.
// uuidv4() is used for one-time initialization.
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

export const initialBoroughs: BoroughList["list"] = [
  { name: "Manhattan", checked: true, id: uuidv4() },
  { name: "Brooklyn", checked: false, id: uuidv4() },
  { name: "Bronx", checked: false, id: uuidv4() },
  { name: "Queens", checked: false, id: uuidv4() },
  { name: "Staten Island", checked: false, id: uuidv4() },
];