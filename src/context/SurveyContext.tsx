import { createContext } from "react";
import {
  PreferenceList,
  ClusterList,
  ReportList,
  initialSurvey,
} from "../constants/surveyConstants";
import useSessionStorage from "../hooks/useSessionStorage";

export type Survey = {
  preference: PreferenceList;
  cluster1: ClusterList;
  cluster2: ClusterList;
  cluster3: ClusterList;
  report: ReportList;
};

type SurveyContextProps = {
  survey: Survey;
  setSurveyContext: (
    newSurveyElement: PreferenceList | ClusterList | ReportList
  ) => void;
};

/**
 * Survey context to manage the survey state from user questionnaires.
 */
export const SurveyContext = createContext<SurveyContextProps>(
  {} as SurveyContextProps
);

/**
 * Survey context provider to manage the survey state.
 */
export function SurveyContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [survey, setSurvey] = useSessionStorage<Survey>(
    "survey",
    initialSurvey
  );

  // update survey context differently based on the survey element
  const setSurveyContext = (
    newSurveyElement: PreferenceList | ClusterList | ReportList
  ) => {
    if (newSurveyElement.name === "preference") {
      setSurvey((prev) => ({
        ...prev,
        preference: { name: "preference", list: newSurveyElement.list },
      }));
    } else if (newSurveyElement.name === "cluster1") {
      setSurvey((prev) => ({
        ...prev,
        cluster1: { name: "cluster1", list: newSurveyElement.list },
      }));
    } else if (newSurveyElement.name === "cluster2") {
      setSurvey((prev) => ({
        ...prev,
        cluster2: { name: "cluster2", list: newSurveyElement.list },
      }));
    } else if (newSurveyElement.name === "cluster3") {
      setSurvey((prev) => ({
        ...prev,
        cluster3: { name: "cluster3", list: newSurveyElement.list },
      }));
    } else if (newSurveyElement.name === "report") {
      setSurvey((prev) => ({
        ...prev,
        report: { name: "report", list: newSurveyElement.list },
      }));
    } else {
      console.error("Invalid survey name");
    }
  };

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
