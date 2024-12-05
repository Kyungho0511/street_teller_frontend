import { createContext, useState } from "react";
import { HealthcareProperties } from "../constants/geoJsonConstants";

type PopupContextProps = {
  property: HealthcareProperties | undefined;
  setProperty: React.Dispatch<
    React.SetStateAction<HealthcareProperties | undefined>
  >;
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
  const [property, setProperty] = useState<HealthcareProperties | undefined>();

  return (
    <PopupContext.Provider
      value={{
        property,
        setProperty,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
}
