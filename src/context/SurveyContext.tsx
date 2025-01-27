import { createContext } from "react";
import {
  PreferenceList,
  ClusterList,
  ReportList,
  initialSurvey,
  ReportSubList,
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
  setSurvey: React.Dispatch<React.SetStateAction<Survey>>;
  getClusterSurvey: () => ClusterList[];
  setClusterSurvey: (clusterId: string, clusterList: ClusterList) => void;
  getReportSubList: () => ReportSubList[];
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

  const getClusterSurvey = () => {
    return [survey.cluster1, survey.cluster2, survey.cluster3];
  };

  const setClusterSurvey = (clusterId: string, clusterList: ClusterList) => {
    setSurvey((prev) => ({ ...prev, [`cluster${clusterId}`]: clusterList }));
  };

  const getReportSubList = () => {
    const reportSubLists = survey.report.list?.map((report) => {
      const subList: ReportSubList = report.clusters?.map((cluster) => ({
        name: cluster.name,
        content: "",
        color: cluster.color,
      }));
      return subList;
    });

    return reportSubLists;
  };

  return (
    <SurveyContext.Provider
      value={{
        survey,
        setSurvey,
        getClusterSurvey,
        setClusterSurvey,
        getReportSubList,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
}
