import { MapContext } from "../../context/MapContext";
import MapPreview from "../organisms/MapPreview";
import styles from "./MapToggleButton.module.css";
import { useContext } from "react";

/**
 * Map toggle button component to switch between satellite and map view.
 */
export default function MapToggleButton() {
  const { toggleMapMode, mapMode } = useContext(MapContext);

  const handleClick = () => {
    toggleMapMode();
  };

  return (
    <>
      <div className={styles.button} onClick={handleClick}>
        <p className={styles.text}>{mapMode === "map" ? "Satellite" : "Map"}</p>
      </div>
      <MapPreview />
    </>
  );
}
