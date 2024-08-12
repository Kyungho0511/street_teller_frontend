import { createContext, useEffect, useState } from "react";
import { Borough, LivingCategory } from "../constants/enums";

type Preference = {category: LivingCategory, ranking: number}

export type Survey = {
  boroughs : Borough[],
  preferences: Preference[],
};

type SurveyContextProps = {
  survey: Survey;
  setSurveyContext: (newSurvey: Survey) => void;
};

export const SurveyContext = createContext<SurveyContextProps>({} as SurveyContextProps);

// Survey state management using Context hooks with session stoarge
export function SurveyContextProvider({children} : {children: React.ReactNode;}) {
  const [survey, setSurvey] = useState<Survey>(initialSurvey);

  const setSurveyContext = (newSurvey: Survey) => {
    setSurvey(newSurvey);
  }
  
  // retrieve stored survey from session storage
  useEffect(() => {
    const storedSurvey = sessionStorage.getItem("survey");
    if (storedSurvey) {
      setSurvey(JSON.parse(storedSurvey));
    }
  }, []);

  // update session storage when survey changes
  useEffect(() => {
    sessionStorage.setItem('survey', JSON.stringify(survey))
  }, [survey])


  return (
    <SurveyContext.Provider value={{survey, setSurveyContext}}>
      {children}
    </SurveyContext.Provider>
  );
}


const initialSurvey: Survey = {
  boroughs: [
    Borough.Manhattan,
    Borough.Brooklyn,
    Borough.Bronx,
    Borough.Queens,
    Borough.StatenIsland,
  ],
  preferences: [
    {category: LivingCategory.HousingCost, ranking: 1},
    {category: LivingCategory.CommunityDemographics, ranking: 2},
    {category: LivingCategory.Transportation, ranking: 3},
    {category: LivingCategory.HealthCare, ranking: 4},
    {category: LivingCategory.Education, ranking: 5},
    {category: LivingCategory.GroceriesAndRestaurants, ranking: 6},
    {category: LivingCategory.ParksAndRecreation, ranking: 7},
  ],
};