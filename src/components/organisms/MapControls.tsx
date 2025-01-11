import styles from "./MapControls.module.css";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import { useContext, useRef } from "react";
import { MapContext } from "../../context/MapContext";
import { FOOTBAR_HEIGHT } from "./Footbar";
import { addControls, addSearchButton } from "../../services/mapbox";

/**
 * Control elements for the map.
 */
export default function MapControls() {
  const { mapViewer } = useContext(MapContext);
  const mapboxcontrolsRef = useRef<HTMLDivElement>(null);

  // Add Mapbox controls to the container.
  useEffectAfterMount(() => {
    if (!mapboxcontrolsRef.current || !mapViewer) return;

    addControls(mapboxcontrolsRef.current, mapViewer);
    addSearchButton(mapboxcontrolsRef.current, mapViewer);
  }, [mapboxcontrolsRef.current, mapViewer]);

  return (
    <div
      ref={mapboxcontrolsRef}
      className={styles.mapControls}
      style={{ bottom: FOOTBAR_HEIGHT }}
    ></div>
  );
}
