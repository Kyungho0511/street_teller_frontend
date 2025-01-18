import { createContext } from "react";
import {
  BoroughList,
  PreferenceList,
  ClusterList,
  initialPreferenceList,
  initialClusterLists,
  initialBoroughList,
  ReportList,
  initialReportLists,
} from "../constants/surveyConstants";
import { parseString } from "../utils/utils";
import useSessionStorage from "../hooks/useSessionStorage";

export type Survey = {
  boroughList: BoroughList;
  preferenceList: PreferenceList;
  clusterLists: ClusterList[];
  reportLists: ReportList[];
};

type SurveyContextProps = {
  survey: Survey;
  setSurveyContext: (
    newSurveyElement: BoroughList | PreferenceList | ClusterList | ReportList
  ) => void;
};

/**
 * Survey context to manage the survey state from users on
 * questionnaire regarding preferences, boroughs, and clusters.
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
    newSurveyElement: BoroughList | PreferenceList | ClusterList | ReportList
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
    } else if (parseString(newSurveyElement.name) === "cluster") {
      setSurvey((prev) => ({
        ...prev,
        clusterLists: prev.clusterLists.map((list) =>
          newSurveyElement.name === list.name ? newSurveyElement : list
        ),
      }));
    } else if (parseString(newSurveyElement.name) === "report") {
      setSurvey((prev) => ({
        ...prev,
        reportLists: prev.reportLists.map((list) =>
          newSurveyElement.name === list.name ? newSurveyElement : list
        ),
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

const initialSurvey: Survey = {
  boroughList: initialBoroughList,
  preferenceList: initialPreferenceList,
  clusterLists: initialClusterLists,
  reportLists: initialReportLists,
};
