import styles from './SatelliteViewer.module.css';
import * as Cesium from 'cesium';
import { useContext, useEffect, useRef } from 'react';
import { CameraContext, CameraState } from '../../context/CameraContext';
import { ViewerContext } from '../../context/ViewerContext';
import "cesium/Build/Cesium/Widgets/widgets.css";
import { GOOGLE_3D_TILES_ID } from '../../constants/3DTilesConstants';
import useEffectAfterMount from '../../hooks/useEffectAfterMount';

/**
 * Cesium satellite viewer component.
 */
export default function SatelliteViewer() {
  const { mapViewer, mapMode, satelliteViewer, setSatelliteViewer } = useContext(ViewerContext);
  const { cameraState, setCameraState, syncMapCamera } = useContext(CameraContext);
  const satelliteContainerRef = useRef<HTMLDivElement>(null);
  const satelliteViewerRef = useRef<Cesium.Viewer>();

  // Initialize the Cesium viewer.
  useEffect(() => {
    if (!satelliteContainerRef.current) return;
    const initializeCesium = async () => {
      Cesium.Ion.defaultAccessToken = import.meta.env.VITE_API_KEY_CESIUM as string;
      satelliteViewerRef.current = new Cesium.Viewer(satelliteContainerRef.current as Element, {
        skyAtmosphere: new Cesium.SkyAtmosphere(),
        scene3DOnly: true,
        globe: false,
        sceneModePicker: false,
        selectionIndicator: false,
        baseLayerPicker: false,
        animation: false,
        timeline: false,
        navigationHelpButton: false,
        infoBox: false,
        geocoder: false,
        fullscreenButton: false,
        homeButton: false,
        vrButton: false,
        targetFrameRate: 60,
        showRenderLoopErrors: false,
      });
      const viewer = satelliteViewerRef.current;
      setSatelliteViewer(viewer);
      viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT;

      try {
        const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(GOOGLE_3D_TILES_ID);
        viewer.scene.primitives.add(tileset);
      } catch (error) {
        console.error(error);
      }
      viewer.resize();
      viewer.render();
    };
    initializeCesium();

    return () => {
      if (satelliteViewerRef.current) {
        satelliteViewerRef.current.destroy();
      }
    }
  }, []);

  // Update the camera state when the map ends moving.
  useEffectAfterMount(() => {
    if (!satelliteViewer) return;

    const onMoveEnd = () => {
      const cartographic = satelliteViewer.camera.positionCartographic;
      setCameraState({
        center: [cartographic.longitude, cartographic.latitude],
        zoom: Math.log2(40075016.686 / cartographic.height) - 1,
        bearing: satelliteViewer.camera.heading,
        pitch: satelliteViewer.camera.pitch,
      } as CameraState);
    }
    satelliteViewer.camera.moveEnd.addEventListener(onMoveEnd);
    
    return () => {
      satelliteViewer.camera.moveEnd.removeEventListener(onMoveEnd);
    }
  }, [satelliteViewer, setCameraState]);

  // useEffectAfterMount(() => {
  //   if (!mapViewer) return;
  //   syncMapCamera(mapViewer, cameraState);
  // }, [mapViewer, syncMapCamera, cameraState]);

  return (
    <div
      ref={satelliteContainerRef}
      className={styles.container}
      style={{
        display: mapMode == "satellite" ? 'block' : 'none',
      }}
    ></div>
  );
}
