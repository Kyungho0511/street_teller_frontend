import { createContext, useState } from "react";
import { Color } from "../constants/mapConstants";

type MapContextProps = {
  map: mapboxgl.Map | undefined;
  setMap: (map: mapboxgl.Map | undefined) => void;
  parentLayer: string | undefined;
  setParentLayer: (layer: string | undefined) => void;
  color: Color | undefined;
  setColor: (color: Color | undefined) => void;
}

export const MapContext = createContext<MapContextProps>({} as MapContextProps);

export function MapContextProvider({children}: {children: React.ReactNode}) {
  const [map, setMap] = useState<mapboxgl.Map>();
  const [parentLayer, setParentLayer] = useState<string>();
  const [color, setColor] = useState<Color>();
  
  return (
    <MapContext.Provider value={{ map, setMap, parentLayer, setParentLayer, color, setColor }}>
      {children}
    </MapContext.Provider>
  );
}