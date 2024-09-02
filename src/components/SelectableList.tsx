import { useEffect, useRef, useState } from "react";
import styles from "./SelectableList.module.css";

export type ListItem = {
  name: string;
  id: string;
}

export default function SelectableList({list}: {list: ListItem[]}) {
  const [selectedItem, setSelectedItem] = useState<string>(list[0].name);

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