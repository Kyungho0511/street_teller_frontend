import { useContext, useEffect, useRef, useState } from "react";
import styles from "./SelectableList.module.css";
import { MapContext } from "../context/MapContext";
import * as mapbox from "../services/mapbox";
import * as mapConstants from "../constants/mapConstants";

type SelectableListProps = {
  list: ListItem[];
  mappable?: boolean;
}

export type ListItem = {
  name: string;
  id: string;
}

export default function SelectableList({list, mappable}: SelectableListProps) {
  const [selectedItem, setSelectedItem] = useState<string>(list[0].name);
  const { map, parentLayer } = useContext(MapContext);

  // Set the first item as the selected item on rerender.
  useEffect(() => {
    setSelectedItem(list[0].name);
  }, [list])

  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const handleClick = (event: React.MouseEvent<HTMLLIElement>, index: number) => {

    // Highlight the selected item.
    const target = event.currentTarget as HTMLLIElement;
    itemRefs.current.forEach((item) => item?.classList.remove(styles.selected));
    target.classList.add(styles.selected);

    // Update the selected item.
    setSelectedItem(list[index].name);

    // Update Mapping with the selected item.
    if (!mappable) return;

    if (!map) {
      console.error("Map is not instantiated.");
      return;
    }
    const bound = mapbox.getBound(selectedItem);
    
    if (!bound) {
      console.error("Bound not found for layer: ", selectedItem);
      return;
    }
    if (!parentLayer) {
      console.error("Parent layer not found for the page.");
      return;
    }
    mapbox.updateLayerStyle(parentLayer, selectedItem, bound, mapConstants.color.yellow, map)
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