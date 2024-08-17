export type Preferences = {
  name: "preferences";
  list: [
    { category: "Housing Cost"; ranking: number },
    { category: "Community Demographics"; ranking: number },
    { category: "Transportation"; ranking: number },
    { category: "Health Care"; ranking: number },
    { category: "Education"; ranking: number },
    { category: "Groceries & Restaurants"; ranking: number },
    { category: "Parks & Recreation"; ranking: number }
  ];
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