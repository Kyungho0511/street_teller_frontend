import styles from "./MapControls.module.css";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import { useContext, useRef } from "react";
import { MapContext } from "../../context/MapContext";
import { FOOTBAR_HEIGHT } from "./Footbar";
import { addControls } from "../../services/mapbox";

export const MAP_CONTROLS_HEIGHT = 120;

/**
 * Control elements for the map.
 */
export default function MapControls() {
  const { mapViewer } = useContext(MapContext);
  const mapboxcontrolsRef = useRef<HTMLDivElement>(null);

  useEffectAfterMount(() => {
    if (!mapboxcontrolsRef.current || !mapViewer) return;

    // addSearchButton(mapboxcontrolsRef.current, mapViewer);
    addControls(mapboxcontrolsRef.current, mapViewer);
  }, [mapboxcontrolsRef.current, mapViewer]);

  return (
    <div
      ref={mapboxcontrolsRef}
      className={styles.mapControls}
      style={{ bottom: FOOTBAR_HEIGHT, height: MAP_CONTROLS_HEIGHT }}
    ></div>
  );
}
