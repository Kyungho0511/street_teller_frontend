import { useContext } from "react";
import styles from "./MapToggleButton.module.css";
import { MapContext } from "../../context/MapContext";

export default function MapToggleButton() {
  const { mapMode, toggleMapMode } = useContext(MapContext);

  const handleClick = () => {
    toggleMapMode();
  };

  return (
    <button
      className={styles.button}
      onClick={handleClick}
    >
      <p className={styles.text}>{mapMode == "map" ? "Satellite" : "Map"}</p>
    </button>
  );
}
