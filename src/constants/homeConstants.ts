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

/**
 * Type definitions for the Home page.
 */
type LivingCategory =
  | "Housing Cost"
  | "Community Demographics"
  | "Transportation"
  | "Health Care"
  | "Education"
  | "Groceries & Restaurants"
  | "Parks & Recreation";


// name is used as a unique identifier when updating the survey context.
export type Preferences = {
  name: "preferences";
  list: { category: LivingCategory; ranking: number; icon: IconDefinition; id: string}[]
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
  { category: "Housing Cost", ranking: 1, icon: faMoneyCheckDollar, id: uuidv4() },
  { category: "Community Demographics", ranking: 2, icon: faPeopleGroup, id: uuidv4() },
  { category: "Transportation", ranking: 3, icon: faPersonWalking, id: uuidv4() },
  { category: "Health Care", ranking: 4, icon: faHospitalUser, id: uuidv4() },
  { category: "Education", ranking: 5, icon: faGraduationCap, id: uuidv4() },
  { category: "Groceries & Restaurants", ranking: 6, icon: faStore, id: uuidv4() },
  { category: "Parks & Recreation", ranking: 7, icon: faTree, id: uuidv4() },
];

export const initialBoroughs: Boroughs["list"] = [
  { name: "Manhattan", checked: true, id: uuidv4() },
  { name: "Brooklyn", checked: false, id: uuidv4() },
  { name: "Bronx", checked: false, id: uuidv4() },
  { name: "Queens", checked: false, id: uuidv4() },
  { name: "Staten Island", checked: false, id: uuidv4() },
];

// Initial text for the response box.
export const initialTextHome: string =
  "Tell us about your life-style by selecting the categories important for your new home. We will tell you about NYC neighborhoods that suit your household the best. Tell us about your life-style by selecting the categories important for your new home. We will tell you about NYC neighborhoods that suit your household the best. Tell us about your life-style by selecting the categories important for your new home. We will tell you about NYC neighborhoods that suit your household the best. Tell us about your life-style by selecting the categories important for your new home. We will tell you about NYC neighborhoods that suit your household the best.";