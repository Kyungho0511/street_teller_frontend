import styles from "./SelectableList.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import { MapContext } from "../../context/MapContext";
import { mapAttributes } from "../../constants/mapConstants";
import * as mapbox from "../../services/mapbox";
import { HealthcareProperties } from "../../constants/geoJsonConstants";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";

type SelectableListProps = {
  list: { name: HealthcareProperties; id: string }[];
};

/**
 * List component with selectable items associated with mapping.
 */
export default function SelectableList({ list }: SelectableListProps) {
  const [selectedItem, setSelectedItem] = useState<HealthcareProperties>(
    list[0].name
  );
  const { mapViewer, parentLayer, color } = useContext(MapContext);
  const { setAttribute } = useContext(MapContext);

  useEffect(() => {
    setSelectedItem(list[0].name);
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
    setSelectedItem(list[index].name);
  };

  return (
    <ul className={styles.list}>
      {list.map((item, index) => (
        <li
          ref={(element) => (itemRefs.current[index] = element)}
          className={`${styles.item} ${
            item.name === selectedItem && styles.selected
          }`}
          key={item.id}
          onClick={(event) => handleClick(event, index)}
        >
          <p className={styles.text}>{item.name}</p>
        </li>
      ))}
    </ul>
  );
}
