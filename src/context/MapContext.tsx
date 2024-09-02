import { createContext, useState } from "react";

type MapContextProps = {
  map: mapboxgl.Map | undefined;
  setMap: (map: mapboxgl.Map | undefined) => void;
  parentLayer: string | undefined;
  setParentLayer: (layer: string | undefined) => void;
}

export const MapContext = createContext<MapContextProps>({} as MapContextProps);

export function MapContextProvider({children}: {children: React.ReactNode}) {
  const [map, setMap] = useState<mapboxgl.Map>();
  const [parentLayer, setParentLayer] = useState<string>();

  return (
    <MapContext.Provider value={{ map, setMap, parentLayer, setParentLayer }}>
      {children}
    </MapContext.Provider>
  );
}