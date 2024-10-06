import styles from "./PopupText.module.css";
import { useContext, useEffect, useState } from "react";
import { HealthcareProperties } from "../../constants/geoJsonConstants";
import { MapContext } from "../../context/MapContext";
import { GEOID, MapAttribute } from "../../constants/mapConstants";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import * as utils from "../../utils/utils";

type PopupTextProps = {
  selectedAttribute: MapAttribute;
};

/**
 * Text component for the popup section.
 */
export default function PopupText({ selectedAttribute }: PopupTextProps) {
  const { map, parentLayer } = useContext(MapContext);
  const [selectedProperties, setSelectedProperties] = useState<HealthcareProperties | undefined>();
  const [formattedValue, setFormattedValue] = useState<string>("");

  useEffect(() => {
    if (!map) return;
    const updateProperties = (event: mapboxgl.MapMouseEvent) => {
      const feature = map.queryRenderedFeatures(event.point, {layers: [parentLayer]})[0];
      setSelectedProperties(feature.properties as HealthcareProperties);
    }
    map.on("mousemove", parentLayer, updateProperties);

    // Cleanup event listeners on component unmount.
    return () => {
      map.off("mousemove", parentLayer, updateProperties);
    }
  }, [map, parentLayer]);

  useEffectAfterMount(() => {
    if (!selectedProperties) return;
    const value = selectedProperties[selectedAttribute.name];
    setFormattedValue(utils.formatUnit(value, selectedAttribute.unit));
  }, [selectedProperties]);

  return (
    <>
      <h4 className={styles.title}>
        {`${GEOID}: ${selectedProperties?.GEOID}`}
      </h4>
      <div className={styles.body}>
        <span className={styles.text}>{selectedAttribute.name}</span>
        <span className={styles.value}>{formattedValue}</span>
      </div>
    </>
  );
}