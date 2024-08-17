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


export type Preferences = {
  name: "preferences";
  list: [
    // Icon names are from fontawesome library
    { category: "Housing Cost"; ranking: number; icon: IconDefinition },
    { category: "Community Demographics"; ranking: number; icon: IconDefinition },
    { category: "Transportation"; ranking: number; icon: IconDefinition },
    { category: "Health Care"; ranking: number; icon: IconDefinition },
    { category: "Education"; ranking: number; icon: IconDefinition },
    { category: "Groceries & Restaurants"; ranking: number; icon: IconDefinition },
    { category: "Parks & Recreation"; ranking: number; icon: IconDefinition }
  ];
};

export const initialPreferences: Preferences["list"] = [
  { category: "Housing Cost", ranking: 1, icon: faMoneyCheckDollar },
  { category: "Community Demographics", ranking: 2, icon: faPeopleGroup },
  { category: "Transportation", ranking: 3, icon: faPersonWalking },
  { category: "Health Care", ranking: 4, icon: faHospitalUser },
  { category: "Education", ranking: 5, icon: faGraduationCap },
  { category: "Groceries & Restaurants", ranking: 6, icon: faStore },
  { category: "Parks & Recreation", ranking: 7, icon: faTree },
];

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

export const initialBoroughs: Boroughs["list"] = [
  { borough: "Manhattan", checked: true },
  { borough: "Brooklyn", checked: true },
  { borough: "Bronx", checked: true },
  { borough: "Queens", checked: true },
  { borough: "Staten Island", checked: false },
];