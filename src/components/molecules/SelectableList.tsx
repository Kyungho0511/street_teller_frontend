import { useContext, useEffect, useRef, useState } from "react";
import styles from "./SelectableList.module.css";
import { MapContext } from "../../context/MapContext";
import { MapAttribute, mapAttributes } from "../../constants/mapConstants";
import * as mapbox from "../../services/mapbox";
import { HealthcarePropertyName } from "../../constants/geoJsonConstants";

type SelectableListProps = {
  list: ListItem[];
  setAttribute?: (newAttribute: MapAttribute) => void;
  mappable?: boolean;
}

export type ListItem = {
  name: HealthcarePropertyName;
  id: string;
}

export default function SelectableList({list, setAttribute, mappable}: SelectableListProps) {
  const [selectedItem, setSelectedItem] = useState<string>(list[0].name);
  const { map, parentLayer, color } = useContext(MapContext);

  useEffect(() => {
    setSelectedItem(list[0].name);
  }, [list])

  useEffect(() => {
    // Update Mapping with the selected item.
    if (map && mappable && parentLayer && color) {
      mapbox.updateLayerStyle(parentLayer, selectedItem, color, map);
    }
    // Update the attribute for map legned.
    if (setAttribute) {
      const newAttribute = mapAttributes.find((attribute) => attribute.name === selectedItem);
      newAttribute ? setAttribute(newAttribute) : console.error("Attribute not found.");
    }
  }, [selectedItem, map, mappable ,parentLayer, color, setAttribute]);

  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const handleClick = (event: React.MouseEvent<HTMLLIElement>, index: number) => {
    // Highlight the selected item.
    const target = event.currentTarget as HTMLLIElement;
    itemRefs.current.forEach((item) => item?.classList.remove(styles.selected));
    target.classList.add(styles.selected);

    // Update the selected item.
    setSelectedItem(list[index].name);
  }

  return (
    <ul className={styles.list}>
      {list.map((item, index) => (
        <li
          ref={(element) => itemRefs.current[index] = element} 
          className={`${styles.item} ${item.name === selectedItem && styles.selected}`}
          key={item.id}
          onClick={(event) => handleClick(event, index)}
        >
          <p className={styles.text}>{item.name}</p>
        </li>
      ))}
    </ul>
  );
}