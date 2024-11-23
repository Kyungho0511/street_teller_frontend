import styles from "./Map3dViewer.module.css";
import * as Cesium from "cesium";
import { useContext, useEffect, useRef } from "react";
import { MapContext } from "../../context/MapContext";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { GOOGLE_3D_TILES_ID } from "../../constants/3DTilesConstants";

/**
 * Cesium 3d viewer component.
 */
export default function Map3dViewer() {
  const { setMap3dViewer } = useContext(MapContext);

  const map3dViewerContainerRef = useRef<HTMLDivElement>(null);
  const map3dViewerRef = useRef<Cesium.Viewer>();

  // Initialize the Cesium viewer.
  useEffect(() => {
    if (!map3dViewerContainerRef.current) return;
    const initializeCesium = async () => {
      Cesium.Ion.defaultAccessToken = import.meta.env
        .VITE_API_KEY_CESIUM as string;
      map3dViewerRef.current = new Cesium.Viewer(
        map3dViewerContainerRef.current as Element,
        {
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
        }
      );
      const viewer = map3dViewerRef.current;
      setMap3dViewer(viewer);
      viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT;

      try {
        const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(
          GOOGLE_3D_TILES_ID
        );
        viewer.scene.primitives.add(tileset);
      } catch (error) {
        console.error(error);
      }
      viewer.resize();
      viewer.render();
    };
    initializeCesium();

    return () => {
      if (map3dViewerRef.current) {
        map3dViewerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={map3dViewerContainerRef}
      className={styles.container}
      style={{
        display: "none",
      }}
    ></div>
  );
}
