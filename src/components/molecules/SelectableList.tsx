import styles from "./SelectableList.module.css";
import { v4 as uuidv4 } from "uuid";
import { useContext, useEffect, useRef, useState } from "react";
import { MapContext } from "../../context/MapContext";
import { mapAttributes } from "../../constants/mapConstants";
import * as mapbox from "../../services/mapbox";
import { HealthcarePropertyName } from "../../constants/geoJsonConstants";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";

type SelectableListProps = {
  list: HealthcarePropertyName[];
};

/**
 * List component with selectable items associated with mapping.
 */
export default function SelectableList({ list }: SelectableListProps) {
  const [selectedItem, setSelectedItem] = useState<HealthcarePropertyName>(
    list[0]
  );
  const { mapViewer, parentLayer, color } = useContext(MapContext);
  const { setAttribute } = useContext(MapContext);

  useEffect(() => {
    setSelectedItem(list[0]);
  }, [list]);

  useEffectAfterMount(() => {
    // Update Mapping with the selected item.
    if (mapViewer && parentLayer && color) {
      mapbox.updateLayerAttribute(parentLayer, selectedItem, color, mapViewer);
    }
    // Update the attribute for map legned.
    if (setAttribute) {
      const newAttribute = mapAttributes.find(
        (attribute) => attribute.name === selectedItem
      );
      newAttribute
        ? setAttribute(newAttribute)
        : console.error("Attribute not found.");
    }
  }, [selectedItem, mapViewer, parentLayer, color, setAttribute]);

  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const handleClick = (
    event: React.MouseEvent<HTMLLIElement>,
    index: number
  ) => {
    // Highlight the selected item.
    const target = event.currentTarget as HTMLLIElement;
    itemRefs.current.forEach((item) => item?.classList.remove(styles.selected));
    target.classList.add(styles.selected);

    // Update the selected item.
    setSelectedItem(list[index]);
  };

  return (
    <ul className={styles.list}>
      {list.map((item, index) => (
        <li
          ref={(element) => (itemRefs.current[index] = element)}
          className={`${styles.item} ${
            item === selectedItem && styles.selected
          }`}
          key={uuidv4()}
          onClick={(event) => handleClick(event, index)}
        >
          <p className={styles.text}>{item}</p>
        </li>
      ))}
    </ul>
  );
}
