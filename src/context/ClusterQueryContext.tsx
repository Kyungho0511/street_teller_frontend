import { createContext, useState } from "react";
import { HealthcareProperties } from "../constants/geoJsonConstants";

type ClusterQueryContextProps = {
  property: HealthcareProperties | undefined;
  setProperty: React.Dispatch<
    React.SetStateAction<HealthcareProperties | undefined>
  >;
  selectedCluster: number | undefined;
  setSelectedCluster: React.Dispatch<React.SetStateAction<number | undefined>>;
  selectedReport: number | undefined;
  setSelectedReport: React.Dispatch<React.SetStateAction<number | undefined>>;
};

export const ClusterQueryContext = createContext<ClusterQueryContextProps>(
  {} as ClusterQueryContextProps
);

/**
 * Context provider to store the queried cluster data
 * from the user interaction on the rendered map features.
 */
export function ClusterQueryContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [property, setProperty] = useState<HealthcareProperties>();
  const [selectedCluster, setSelectedCluster] = useState<number>();
  const [selectedReport, setSelectedReport] = useState<number>();

  console.log(selectedCluster);

  return (
    <ClusterQueryContext.Provider
      value={{
        property,
        setProperty,
        selectedCluster,
        setSelectedCluster,
        selectedReport,
        setSelectedReport,
      }}
    >
      {children}
    </ClusterQueryContext.Provider>
  );
}
