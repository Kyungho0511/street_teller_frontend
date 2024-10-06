import { createContext, useState } from "react";
import { HealthcareProperties } from "../constants/geoJsonConstants";

type PopupContextProps = {
  properties: HealthcareProperties | undefined;
  setProperties: React.Dispatch<
    React.SetStateAction<HealthcareProperties | undefined>
  >;
};

export const PopupContext = createContext<PopupContextProps>({} as PopupContextProps);

export function PopupContextProvider({children}: {children: React.ReactNode}) {
  const [properties, setProperties] = useState<HealthcareProperties | undefined>();

  return (
    <PopupContext.Provider
      value={{
        properties,
        setProperties,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
}