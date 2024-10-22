import React, { createContext, useState } from 'react';
import * as Cesium from 'cesium';
import { configs } from '../constants/mapConstants';

export type CameraState = {
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
}

type CameraContextProps = {
  cameraState: CameraState;
  setCameraState: React.Dispatch<React.SetStateAction<CameraState>>;
  syncMapCamera: (mapViewer: mapboxgl.Map, cameraState: CameraState) => void;
  syncSatelliteCamera: (satelliteViewer: Cesium.Viewer, cameraState: CameraState) => void;
}

export const CameraContext = createContext<CameraContextProps>({} as CameraContextProps);

export function CameraContextProvider({children}: {children: React.ReactNode}) {
  const [cameraState, setCameraState] = useState<CameraState>({
    center: configs.location.center as [number, number],
    zoom: configs.location.zoom,
    bearing: configs.location.bearing,
    pitch: configs.location.pitch,
  });

  console.log(cameraState.center[0]);

  const syncMapCamera = (mapViewer: mapboxgl.Map, cameraState: CameraState) => {
    if (mapViewer) {
      mapViewer.jumpTo({
        center: cameraState.center,
        zoom: cameraState.zoom,
        bearing: cameraState.bearing,
        pitch: cameraState.pitch,
      });
    }
  }

  const syncSatelliteCamera = (satelliteViewer: Cesium.Viewer, cameraState: CameraState) => {
    if (satelliteViewer) {
      const { center, zoom, bearing, pitch } = cameraState;
      const altitude = 40075016.686 / Math.pow(2, zoom + 1);
      
      satelliteViewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(center[0], center[1], altitude),
        orientation: {
          heading: Cesium.Math.toRadians(bearing),
          pitch: Cesium.Math.toRadians(pitch - 90),
          roll: 0,
        },
      });
    }
  }

  return (
    <CameraContext.Provider
      value={{
        cameraState,
        setCameraState,
        syncMapCamera,
        syncSatelliteCamera,
      }}
    >
      {children}
    </CameraContext.Provider>
  );
};
