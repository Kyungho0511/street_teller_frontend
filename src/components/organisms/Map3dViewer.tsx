import styles from "./Map3dViewer.module.css";
import * as Cesium from "cesium";
import { useContext, useEffect, useRef } from "react";
import { MapContext } from "../../context/MapContext";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { createMap3D, enableAutoRotate, setView } from "../../services/cesium";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import { MapQueryContext } from "../../context/MapQueryContext";
import Tag from "../atoms/Tag";
import { ROTATION_SPEED } from "../../constants/map3DConstants";

type Map3dViewerProps = {
  visible?: boolean;
};

/**
 * Cesium 3d viewer component.
 */
export default function Map3dViewer({ visible = true }: Map3dViewerProps) {
  const { map3dPreview, setMap3dPreview } = useContext(MapContext);
  const { selectedFeaturePosition } = useContext(MapQueryContext);

  const map3dContainerRef = useRef<HTMLDivElement>(null);
  const map3dRef = useRef<Cesium.Viewer>();
  const removeRotateRef = useRef<() => void>();

  // Initialize the Cesium viewer.
  useEffect(() => {
    if (!map3dContainerRef.current) return;
    createMap3D(map3dContainerRef, map3dRef).then((viewer) => {
      viewer.scene.screenSpaceCameraController.enableInputs = false;
      setMap3dPreview(viewer);
    });

    return () => {
      map3dPreview && map3dPreview.destroy();
      removeRotateRef.current && removeRotateRef.current();
    };
  }, []);

  // Set view to the selected feature position.
  useEffectAfterMount(() => {
    if (!map3dPreview || !selectedFeaturePosition) return;

    setView(selectedFeaturePosition, map3dPreview);

    removeRotateRef.current && removeRotateRef.current();
    removeRotateRef.current = enableAutoRotate(
      selectedFeaturePosition,
      ROTATION_SPEED,
      map3dPreview
    );
  }, [selectedFeaturePosition]);

  // Remove the auto rotation if the viewer is not visible.
  useEffectAfterMount(() => {
    if (!map3dPreview) return;

    !visible && removeRotateRef.current && removeRotateRef.current();
  }, [visible]);

  return (
    <div
      ref={map3dContainerRef}
      className={styles.container}
      style={{ visibility: visible ? "visible" : "hidden" }}
    >
      <Tag text="Immersive View" position="top-left" />
    </div>
  );
}
