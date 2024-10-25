import styles from "./PopupText.module.css";
import { useContext, useState } from "react";
import { GEOID, MapAttribute } from "../../constants/mapConstants";
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
export default function PopupTextHome({ selectedAttribute }: PopupTextHomeProps) {
  const { properties } = useContext(PopupContext);
  const [formattedValue, setFormattedValue] = useState<string>("");

  useEffectAfterMount(() => {
    if (!properties) return;
    const value = properties[selectedAttribute.name];
    setFormattedValue(utils.formatUnit(value, selectedAttribute.unit));
  }, [properties]);

  return (
    <>
      <h4 className={styles.title}>
        {`${GEOID}: ${properties?.GEOID}`}
      </h4>
      <div className={styles.body}>
        <span className={styles.text}>{selectedAttribute.name}</span>
        <span className={styles.value}>{formattedValue}</span>
      </div>
    </>
  );
}