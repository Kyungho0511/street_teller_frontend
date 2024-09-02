import { v4 as uuidv4 } from 'uuid';
import {
  faMoneyCheckDollar,
  faPeopleGroup,
  faPersonWalking,
  faHospitalUser,
  faGraduationCap,
  faStore,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Type definitions for the Home page.
 */
type SiteCategory =
  | "Unserved Population Density"
  | "Insured Population Density"
  | "Health Status"
  | "Income & Expenses"
  | "Land Use"
  | "Mode of Transportation";

// name is used as a unique identifier when updating the survey context.
export type Preferences = {
  name: "preferences";
  list: { category: SiteCategory; ranking: number; icon: IconDefinition; id: string}[]
};

export type Boroughs = {
  name: "boroughs";
  list: [
    { name: "Manhattan"; checked: boolean; id: string },
    { name: "Brooklyn"; checked: boolean; id: string },
    { name: "Bronx"; checked: boolean; id: string },
    { name: "Queens"; checked: boolean; id: string },
    { name: "Staten Island"; checked: boolean; id: string }
  ];
};

// Initial values for the survey context.
// uuidv4() is used for one-time initialization.
export const initialPreferences: Preferences["list"] = [
  { category: "Unserved Population Density", ranking: 1, icon: faMoneyCheckDollar, id: uuidv4() },
  { category: "Insured Population Density", ranking: 2, icon: faPeopleGroup, id: uuidv4() },
  { category: "Health Status", ranking: 3, icon: faPersonWalking, id: uuidv4() },
  { category: "Income & Expenses", ranking: 4, icon: faHospitalUser, id: uuidv4() },
  { category: "Land Use", ranking: 5, icon: faGraduationCap, id: uuidv4() },
  { category: "Mode of Transportation", ranking: 6, icon: faStore, id: uuidv4() },
];

export const initialBoroughs: Boroughs["list"] = [
  { name: "Manhattan", checked: true, id: uuidv4() },
  { name: "Brooklyn", checked: false, id: uuidv4() },
  { name: "Bronx", checked: false, id: uuidv4() },
  { name: "Queens", checked: false, id: uuidv4() },
  { name: "Staten Island", checked: false, id: uuidv4() },
];