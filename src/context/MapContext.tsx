import { createContext, useState } from "react";
import { Color } from "../constants/mapConstants";

type MapContextProps = {
  map: mapboxgl.Map | undefined;
  setMap: React.Dispatch<React.SetStateAction<mapboxgl.Map | undefined>>;
  parentLayer: string;
  setParentLayer: React.Dispatch<React.SetStateAction<string>>;
  color: Color | undefined;
  setColor: React.Dispatch<React.SetStateAction<Color | undefined>>;
  satelliteMode: boolean;
  setSatelliteMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MapContext = createContext<MapContextProps>({} as MapContextProps);

export function MapContextProvider({children}: {children: React.ReactNode}) {
  const [map, setMap] = useState<mapboxgl.Map>();
  const [parentLayer, setParentLayer] = useState<string>("");
  const [color, setColor] = useState<Color>();
  const [satelliteMode, setSatelliteMode] = useState<boolean>(true);

  return (
    <MapContext.Provider
      value={{
        map,
        setMap,
        parentLayer,
        setParentLayer,
        color,
        setColor,
        satelliteMode,
        setSatelliteMode,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}
