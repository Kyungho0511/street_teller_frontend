import styles from "./PopupContent.module.css";
import { useContext, useState } from "react";
import { MapAttribute } from "../../constants/mapConstants";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import * as utils from "../../utils/utils";
import { PopupContext } from "../../context/PopupContext";
import HomePage from "../../pages/HomePage";

type PopupContentHomeProps = {
  selectedAttribute: MapAttribute;
};

/**
 * Popup content component for the {@link HomePage}
 */
export default function PopupContentHome({
  selectedAttribute,
}: PopupContentHomeProps) {
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
      <p className={styles.title}>{`${neighborhoodName}, ${countyName}`}</p>
      <div className={styles.body}>
        <span className={styles.text}>{selectedAttribute.name}</span>
        <span className={styles.value}>{formattedValue}</span>
      </div>
    </>
  );
}
