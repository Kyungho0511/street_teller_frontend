import styles from "./PopupContent.module.css";
import { useContext, useState } from "react";
import { MapAttribute } from "../../constants/mapConstants";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import * as utils from "../../utils/utils";
import { MapQueryContext } from "../../context/MapQueryContext";
import HomePage from "../../pages/HomePage";
import useNameFromMap from "../../hooks/useNameFromMap";

type PopupContentHomeProps = {
  selectedAttribute: MapAttribute;
};

/**
 * Popup content component for the {@link HomePage}
 */
export default function PopupContentHome({
  selectedAttribute,
}: PopupContentHomeProps) {
  const { hoveredProperty } = useContext(MapQueryContext);
  const [formattedValue, setFormattedValue] = useState<string>("");
  const { hoveredCountyName, hoveredNeighborhoodName } = useNameFromMap();

  useEffectAfterMount(() => {
    if (!hoveredProperty) return;

    const value = hoveredProperty[selectedAttribute.name] as number;
    setFormattedValue(utils.formatUnit(value, selectedAttribute.unit));
  }, [hoveredProperty]);

  return (
    <>
      <p
        className={styles.title}
      >{`${hoveredNeighborhoodName}, ${hoveredCountyName}`}</p>
      <div className={styles.body}>
        <div className={styles.item}>
          <span className={styles.text}>{selectedAttribute.name}</span>
          <span className={styles.value}>{formattedValue}</span>
        </div>
      </div>
    </>
  );
}
