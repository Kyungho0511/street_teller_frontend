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

type LivingCategory =
  | "Housing Cost"
  | "Community Demographics"
  | "Transportation"
  | "Health Care"
  | "Education"
  | "Groceries & Restaurants"
  | "Parks & Recreation";

export type Preferences = {
  name: "preferences";
  list: { category: LivingCategory; ranking: number; icon: IconDefinition }[]
};

export type Boroughs = {
  name: "boroughs";
  list: [
    { borough: "Manhattan"; checked: boolean },
    { borough: "Brooklyn"; checked: boolean },
    { borough: "Bronx"; checked: boolean },
    { borough: "Queens"; checked: boolean },
    { borough: "Staten Island"; checked: boolean }
  ];
};

/**
 * Initial constant values for the survey context.
 */
export const initialPreferences: Preferences["list"] = [
  { category: "Housing Cost", ranking: 1, icon: faMoneyCheckDollar },
  { category: "Community Demographics", ranking: 2, icon: faPeopleGroup },
  { category: "Transportation", ranking: 3, icon: faPersonWalking },
  { category: "Health Care", ranking: 4, icon: faHospitalUser },
  { category: "Education", ranking: 5, icon: faGraduationCap },
  { category: "Groceries & Restaurants", ranking: 6, icon: faStore },
  { category: "Parks & Recreation", ranking: 7, icon: faTree },
];

export const initialBoroughs: Boroughs["list"] = [
  { borough: "Manhattan", checked: true },
  { borough: "Brooklyn", checked: true },
  { borough: "Bronx", checked: true },
  { borough: "Queens", checked: true },
  { borough: "Staten Island", checked: false },
];