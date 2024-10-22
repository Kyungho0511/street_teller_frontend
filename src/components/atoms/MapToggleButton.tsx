import { ViewerContext } from "../../context/ViewerContext";
import styles from "./MapToggleButton.module.css";
import { useContext } from "react";
import SatelliteViewer from "../organisms/SatelliteViewer";
import MapViewer from "../organisms/MapViewer";

/**
 * Map toggle button component to switch between 
 * a {@link SatelliteViewer} and a {@link MapViewer}.
 */
export default function MapToggleButton() {
  const { mapMode, toggleMapMode } = useContext(ViewerContext);

  const handleClick = () => {
    toggleMapMode();
  };

  return (
    <button
      className={styles.button}
      onClick={handleClick}
    >
      <p className={styles.text}>{mapMode === "map" ? "Satellite" : "Map"}</p>
    </button>
  );
}
