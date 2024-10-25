import React, { createContext, useContext, useState } from 'react';
import * as Cesium from 'cesium';
import { configs } from '../constants/mapConstants';
import { ViewerContext } from './ViewerContext';

export type CameraState = {
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
}

type CameraContextProps = {
  cameraState: CameraState;
  setCameraState: React.Dispatch<React.SetStateAction<CameraState>>;
  syncMapCamera: (cameraState: CameraState) => void;
  syncSatelliteCamera: (cameraState: CameraState) => void;
}

/**
 * Context that stores the camera state in cartographic coordinates.
 */
export const CameraContext = createContext<CameraContextProps>({} as CameraContextProps);

/**
 * Context provider that stores the camera state in cartographic coordinates.
 */
export function CameraContextProvider({children}: {children: React.ReactNode}) {
  const { mapViewer, satelliteViewer } = useContext(ViewerContext);
  const [cameraState, setCameraState] = useState<CameraState>({
    center: configs.location.center as [number, number],
    zoom: configs.location.zoom,
    bearing: configs.location.bearing,
    pitch: configs.location.pitch,
  });

  const syncMapCamera = (cameraState: CameraState) => {
    if (!mapViewer) return;

    mapViewer.jumpTo({
      center: cameraState.center,
      zoom: cameraState.zoom,
      bearing: cameraState.bearing,
      pitch: cameraState.pitch,
    });
  }

  const syncSatelliteCamera = (cameraState: CameraState) => {
    if (!satelliteViewer) return;

    const { center, zoom, bearing, pitch } = cameraState;
    
    // Calculate altitude based on zoom level
    const earthCircumference = 40075016.686; // in meters
    const groundResolution = earthCircumference * Math.cos(Cesium.Math.toRadians(center[1])) / (256 * Math.pow(2, zoom));
    const modifier = 0.785;
    const altitude = modifier * groundResolution * (satelliteViewer.canvas.clientHeight / 2) / Math.tan(Cesium.Math.toRadians(30));

    const cartographic = new Cesium.Cartographic(
      Cesium.Math.toRadians(center[0]),  // longitude
      Cesium.Math.toRadians(center[1]),  // latitude
      altitude
    );

    satelliteViewer.camera.setView({
      destination: Cesium.Ellipsoid.WGS84.cartographicToCartesian(cartographic),
      orientation: {
        heading: Cesium.Math.toRadians(bearing),
        pitch: Cesium.Math.toRadians(pitch - 90),
        roll: 0,
      },
    });
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
}
