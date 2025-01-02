import styles from "./MapControls.module.css";
import LocationSearchBar from "../molecules/LocationSearchBar";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import { useContext, useRef } from "react";
import { relocateControls } from "../../services/mapbox";
import { MapContext } from "../../context/MapContext";

/**
 * Control elements for the map.
 */
export default function MapControls() {
  const { mapViewer } = useContext(MapContext);
  const mapboxcontrolsRef = useRef<HTMLDivElement>(null);

  // Relocate Mapbox controls to the container.
  useEffectAfterMount(() => {
    if (!mapboxcontrolsRef.current || !mapViewer) return;
    mapViewer.on("idle", () => {
      relocateControls(mapboxcontrolsRef.current!);
    });
  }, [mapboxcontrolsRef.current, mapViewer]);

  return (
    <div ref={mapboxcontrolsRef} className={styles.mapControls}>
      <LocationSearchBar />
    </div>
  );
}
