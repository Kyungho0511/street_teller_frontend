import { createContext, useEffect, useState } from "react";
import { BoroughList, initialBoroughs, initialPreferences, PreferenceList } from "../constants/homeConstants";
import { ClusterList, clusterLists } from "../constants/clusterConstants";

export type Survey = {
  boroughList : BoroughList['list'],
  preferenceList: PreferenceList['list'],
  clusterLists: ClusterList[]
};

type SurveyContextProps = {
  survey: Survey;
  setSurveyContext: (newSurveyElement: BoroughList | PreferenceList | ClusterList) => void;
};

export const SurveyContext = createContext<SurveyContextProps>({} as SurveyContextProps);

// The provider is used in Root.tsx to wrap the Outlet components.
export function SurveyContextProvider({children} : {children: React.ReactNode;}) {
  const [survey, setSurvey] = useState<Survey>(initialSurvey);

  // update survey context differently based on the survey element
  const setSurveyContext = (
    newSurveyElement: BoroughList | PreferenceList | ClusterList,
    clusterIndex?: number
  ) => {
    if (newSurveyElement.name === "boroughs") {
      setSurvey((prev) => ({ ...prev, boroughList: newSurveyElement.list }));
    } else if (newSurveyElement.name === "preferences") {
      setSurvey((prev) => ({ ...prev, preferenceList: newSurveyElement.list }));
    } else if (newSurveyElement.name === "clusterList" && clusterIndex) {
      setSurvey((prev) => ({
        ...prev,
        clusterLists: prev.clusterLists.map((list, i) =>
          i === clusterIndex ? newSurveyElement : list
        ),
      }));
    } else {
      console.error("Invalid survey name");
    }
  };
  
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
    <SurveyContext.Provider
      value={{
        survey,
        setSurveyContext,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
}

const initialSurvey: Survey = {
  boroughList: initialBoroughs,
  preferenceList: initialPreferences,
  clusterLists: clusterLists
};