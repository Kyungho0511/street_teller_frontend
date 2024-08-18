import { createContext, useEffect, useState } from "react";
import { Boroughs, initialBoroughs, initialPreferences, Preferences } from "../constants/homeConstants";

export type Survey = {
  boroughs : Boroughs['list'],
  preferences: Preferences['list'],
};

type SurveyContextProps = {
  survey: Survey;
  setSurveyContext: (newSurveyElement: Boroughs | Preferences) => void;
};

export const SurveyContext = createContext<SurveyContextProps>({} as SurveyContextProps);

export function SurveyContextProvider({children} : {children: React.ReactNode;}) {
  const [survey, setSurvey] = useState<Survey>(initialSurvey);

  // update survey context differently based on the survey element
  const setSurveyContext = (newSurveyElement: Boroughs | Preferences) => {
    if (newSurveyElement.name === "boroughs") {
      setSurvey((prev) => ({...prev, boroughs: newSurveyElement.list}));
    } 
    else if (newSurveyElement.name === "preferences") {
      setSurvey((prev) => ({...prev, preferences: newSurveyElement.list}));
    }
    else {
      console.error("Invalid survey name");
    }
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
  boroughs: initialBoroughs,
  preferences: initialPreferences
};