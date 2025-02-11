import styles from "./PopupContent.module.css";
import { useContext, useState } from "react";
import { MapAttribute } from "../../constants/mapConstants";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import * as utils from "../../utils/utils";
import { PopupContext } from "../../context/PopupContext";
import HomePage from "../../pages/HomePage";
import useNameFromMap from "../../hooks/useNeighborhoodName";

type PopupContentHomeProps = {
  selectedAttribute: MapAttribute;
};

/**
 * Popup content component for the {@link HomePage}
 */
export default function PopupContentHome({
  selectedAttribute,
}: PopupContentHomeProps) {
  const { property } = useContext(PopupContext);
  const [formattedValue, setFormattedValue] = useState<string>("");
  const [countyName, neighborhoodName] = useNameFromMap();

  useEffectAfterMount(() => {
    if (!property) return;

    const value = property[selectedAttribute.name] as number;
    setFormattedValue(utils.formatUnit(value, selectedAttribute.unit));
  }, [property]);

  return (
    <>
      <p className={styles.title}>{`${neighborhoodName}, ${countyName}`}</p>
      <div className={styles.body}>
        <div className={styles.item}>
          <span className={styles.text}>{selectedAttribute.name}</span>
          <span className={styles.value}>{formattedValue}</span>
        </div>
      </div>
    </>
  );
}
