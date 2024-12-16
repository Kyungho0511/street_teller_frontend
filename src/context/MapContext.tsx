import { createContext, useEffect, useState } from "react";
import {
  Color,
  mapConfigs,
  Location,
  MapAttribute,
  mapSections,
} from "../constants/mapConstants";
import MapViewer from "../components/organisms/MapViewer";
import Map3dViewer from "../components/organisms/Map3dViewer";
import * as Cesium from "cesium";
import useSessionStorage from "../hooks/useSessionStorage";

export type MapMode = "satellite" | "map";

type MapContextProps = {
  mapViewer: mapboxgl.Map | undefined;
  setMapViewer: React.Dispatch<React.SetStateAction<mapboxgl.Map | undefined>>;
  mapPreview: mapboxgl.Map | undefined;
  setMapPreview: React.Dispatch<React.SetStateAction<mapboxgl.Map | undefined>>;
  map3dViewer: Cesium.Viewer | undefined;
  setMap3dViewer: React.Dispatch<
    React.SetStateAction<Cesium.Viewer | undefined>
  >;
  parentLayer: string;
  setParentLayer: React.Dispatch<React.SetStateAction<string>>;
  attribute: MapAttribute;
  setAttribute: React.Dispatch<React.SetStateAction<MapAttribute>>;
  color: Color | undefined;
  setColor: React.Dispatch<React.SetStateAction<Color | undefined>>;
  mapMode: MapMode;
  toggleMapMode: () => void;
  previewMode: MapMode;
  location: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
};

/**
 * Context that stores states of {@link Map3dViewer} and {@link MapViewer}.
 */
export const MapContext = createContext<MapContextProps>({} as MapContextProps);

/**
 * Context provider that stores states of {@link Map3dViewer} and {@link MapViewer}.
 */
export function MapContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mapViewer, setMapViewer] = useState<mapboxgl.Map>();
  const [mapPreview, setMapPreview] = useState<mapboxgl.Map>();
  const [map3dViewer, setMap3dViewer] = useState<Cesium.Viewer>();
  const [parentLayer, setParentLayer] = useState<string>("");
  const [location, setLocation] = useState<Location>(
    mapConfigs.location as Location
  );
  const [attribute, setAttribute] = useState<MapAttribute>(
    () => mapSections.find((sec) => sec.id === "home")!.attribute!
  );

  const [color, setColor] = useState<Color>();
  const [mapMode, setMapMode] = useState<MapMode>(() => {
    const mode = localStorage.getItem("mapMode") as MapMode | null;
    return mode ? mode : "map";
  });

  const [previewMode, setPreviewMode] = useState<MapMode>(() =>
    mapMode === "satellite" ? "map" : "satellite"
  );

  useEffect(() => {
    document.documentElement.setAttribute("map-mode", mapMode);
    localStorage.setItem("mapMode", mapMode);
  }, [mapMode]);

  const toggleMapMode = () => {
    setMapMode((prevMode) => (prevMode === "satellite" ? "map" : "satellite"));
    setPreviewMode((prevMode) =>
      prevMode === "satellite" ? "map" : "satellite"
    );
  };

  return (
    <MapContext.Provider
      value={{
        mapViewer,
        setMapViewer,
        mapPreview,
        setMapPreview,
        map3dViewer,
        setMap3dViewer,
        parentLayer,
        setParentLayer,
        attribute,
        setAttribute,
        color,
        setColor,
        mapMode,
        toggleMapMode,
        previewMode,
        location,
        setLocation,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}
