import { MapContext } from "../../context/MapContext";
import styles from "./MapToggleButton.module.css";
import { useContext } from "react";

/**
 * Map toggle button component to switch between satellite and map view.
 */
export default function MapToggleButton() {
  const { mapMode, toggleMapMode } = useContext(MapContext);

  const handleClick = () => {
    toggleMapMode();
  };

  return (
    <button className={styles.button} onClick={handleClick}>
      <p className={styles.text}>{mapMode === "map" ? "Satellite" : "Map"}</p>
    </button>
  );
}
