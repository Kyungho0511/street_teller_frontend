import styles from "./PopupText.module.css";
import { useContext, useState } from "react";
import { MapAttribute } from "../../constants/mapConstants";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import * as utils from "../../utils/utils";
import { PopupContext } from "../../context/PopupContext";
import HomePage from "../../pages/HomePage";

type PopupTextHomeProps = {
  selectedAttribute: MapAttribute;
};

/**
 * Popup text component for the {@link HomePage}
 */
export default function PopupTextHome({
  selectedAttribute,
}: PopupTextHomeProps) {
  const { properties } = useContext(PopupContext);
  const [formattedValue, setFormattedValue] = useState<string>("");
  const [countyName, setCountyName] = useState<string>("");
  const [neighborhoodName, setNeighborhoodName] = useState<string>("");

  useEffectAfterMount(() => {
    if (!properties) return;
    const value = properties[selectedAttribute.name];
    setFormattedValue(utils.formatUnit(value, selectedAttribute.unit));

    const geoid = properties.GEOID.toString();
    setCountyName(utils.getCountyName(geoid));
    setNeighborhoodName(utils.getNeighborhoodName(geoid));
  }, [properties]);

  return (
    <>
      <h4 className={styles.title}>{`${neighborhoodName}, ${countyName}`}</h4>
      <div className={styles.body}>
        <span className={styles.text}>{selectedAttribute.name}</span>
        <span className={styles.value}>{formattedValue}</span>
      </div>
    </>
  );
}
