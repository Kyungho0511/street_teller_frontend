import { createContext, useState } from "react";
import { HealthcareProperties } from "../constants/geoJsonConstants";
import { Position } from "geojson";

type MapQueryContextProps = {
  hoveredProperty: HealthcareProperties | undefined;
  setHoveredProperty: React.Dispatch<
    React.SetStateAction<HealthcareProperties | undefined>
  >;
  selectedProperty: HealthcareProperties | undefined;
  setSelectedProperty: React.Dispatch<
    React.SetStateAction<HealthcareProperties | undefined>
  >;
  selectedCluster: number | undefined;
  setSelectedCluster: React.Dispatch<React.SetStateAction<number | undefined>>;
  selectedClusterInfo: number | undefined;
  setSelectedClusterInfo: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  selectedReport: number | undefined;
  setSelectedReport: React.Dispatch<React.SetStateAction<number | undefined>>;
  selectedFeaturePosition: Position | undefined;
  setSelectedFeaturePosition: React.Dispatch<
    React.SetStateAction<Position | undefined>
  >;
};

/**
 * Context that stores queried map data from the
 * user interaction on the rendered map features.
 */
export const MapQueryContext = createContext<MapQueryContextProps>(
  {} as MapQueryContextProps
);

/**
 * Context provider to store the queried map data
 * from the user interaction on the rendered map features.
 */
export function MapQueryContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hoveredProperty, setHoveredProperty] =
    useState<HealthcareProperties>();
  const [selectedProperty, setSelectedProperty] =
    useState<HealthcareProperties>();
  const [selectedCluster, setSelectedCluster] = useState<number>();
  const [selectedClusterInfo, setSelectedClusterInfo] = useState<number>();
  const [selectedReport, setSelectedReport] = useState<number>();
  const [selectedFeaturePosition, setSelectedFeaturePosition] =
    useState<Position>();

  return (
    <MapQueryContext.Provider
      value={{
        hoveredProperty,
        setHoveredProperty,
        selectedProperty,
        setSelectedProperty,
        selectedCluster,
        setSelectedCluster,
        selectedClusterInfo,
        setSelectedClusterInfo,
        selectedReport,
        setSelectedReport,
        selectedFeaturePosition,
        setSelectedFeaturePosition,
      }}
    >
      {children}
    </MapQueryContext.Provider>
  );
}
