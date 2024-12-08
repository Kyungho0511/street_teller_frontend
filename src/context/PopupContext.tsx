import { createContext, useState } from "react";
import { HealthcareProperties } from "../constants/geoJsonConstants";

type PopupContextProps = {
  property: HealthcareProperties | undefined;
  setProperty: React.Dispatch<
    React.SetStateAction<HealthcareProperties | undefined>
  >;
  selectedCluster: number | undefined;
  setSelectedCluster: React.Dispatch<React.SetStateAction<number | undefined>>;
};

export const PopupContext = createContext<PopupContextProps>(
  {} as PopupContextProps
);

/**
 * Context provider for the popup.
 */
export function PopupContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [property, setProperty] = useState<HealthcareProperties>();
  const [selectedCluster, setSelectedCluster] = useState<number>();

  return (
    <PopupContext.Provider
      value={{
        property,
        setProperty,
        selectedCluster,
        setSelectedCluster,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
}
