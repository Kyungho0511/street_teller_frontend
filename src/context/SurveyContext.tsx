import { createContext, useState } from "react";
import { BoroughList, PreferenceList, ClusterList, initialPreferenceList, initialClusterLists, initialBoroughList } from "../constants/surveyConstants";

export type Survey = {
  boroughList : BoroughList,
  preferenceList: PreferenceList,
  clusterLists: ClusterList[]
};

type SurveyContextProps = {
  survey: Survey;
  setSurveyContext: (newSurveyElement: BoroughList | PreferenceList | ClusterList) => void;
};

/**
 * Survey context to manage the survey state from users on 
 * questionnaire regarding preferences, boroughs, and clusters.
 */
export const SurveyContext = createContext<SurveyContextProps>({} as SurveyContextProps);

/**
 * Survey context provider to manage the survey state.
 */
export function SurveyContextProvider({children} : {children: React.ReactNode;}) {
  const [survey, setSurvey] = useState<Survey>(initialSurvey);

  // update survey context differently based on the survey element
  const setSurveyContext = (
    newSurveyElement: BoroughList | PreferenceList | ClusterList,
  ) => {
    if (newSurveyElement.name === "boroughs") {
      setSurvey((prev) => ({
        ...prev,
        boroughList: { name: "boroughs", list: newSurveyElement.list },
      }));
    } else if (newSurveyElement.name === "preferences") {
      setSurvey((prev) => ({
        ...prev,
        preferenceList: { name: "preferences", list: newSurveyElement.list },
      }));
    } else if (["cluster1", "cluster2", "cluster3"].includes(newSurveyElement.name)) {
      setSurvey((prev) => ({
        ...prev,
        clusterLists: prev.clusterLists.map((list) =>
          newSurveyElement.name === list.name ? newSurveyElement : list
        ),
      }));
    } else {
      console.error("Invalid survey name");
    }
  };
  
  // // retrieve stored survey from session storage
  // useEffect(() => { 
  //   const storedSurvey = sessionStorage.getItem("survey"); 
  //   if (storedSurvey) {
  //     setSurvey(JSON.parse(storedSurvey));
  //   }
  // }, []);

  // // update session storage when survey changes
  // useEffect(() => {
  //   sessionStorage.setItem('survey', JSON.stringify(survey))
  // }, [survey])

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
  boroughList: initialBoroughList,
  preferenceList: initialPreferenceList,
  clusterLists: initialClusterLists
};