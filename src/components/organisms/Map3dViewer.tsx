import styles from "./Map3dViewer.module.css";
import * as Cesium from "cesium";
import { useContext, useEffect, useRef } from "react";
import { MapContext } from "../../context/MapContext";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { createMap3D } from "../../services/cesium";

/**
 * Cesium 3d viewer component.
 */
export default function Map3dViewer() {
  const { map3dPreview, setMap3dPreview } = useContext(MapContext);

  const map3dContainerRef = useRef<HTMLDivElement>(null);
  const map3dRef = useRef<Cesium.Viewer>();

  // Initialize the Cesium viewer.
  useEffect(() => {
    if (!map3dContainerRef.current) return;
    createMap3D(map3dContainerRef, map3dRef).then(setMap3dPreview);

    return () => {
      if (map3dPreview) {
        map3dPreview.destroy();
      }
    };
  }, []);

  return <div ref={map3dContainerRef} className={styles.container}></div>;
}
