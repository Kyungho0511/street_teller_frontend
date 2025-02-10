import styles from "./DropdownList.module.css";
import { DropdownManager } from "./DropdownManager";
import { ListItem } from "../../constants/surveyConstants";

export type DropdownListProps = {
  list: ListItem;
  index: number;
  toggleList: (index: number) => void;
  expanded: boolean;
};

/**
 * List component to be used with {@link DropdownManager} component.
 * @param list List of items to be displayed.
 */
export default function DropdownList({
  list,
  index,
  toggleList,
  expanded,
}: DropdownListProps) {
  return (
    <div className={`${styles.container} ${expanded && styles.expanded}`}>
      <button className={styles.list_button} onClick={() => toggleList(index)}>
        <div>
          <p className={styles.title}>{`${index + 1}. ${list.name}`}</p>
          <p className={styles.subtitle}>
            {list.geoIds &&
              `(4 listings in ${list.geoIds.length} census tracts)`}
          </p>
        </div>
        <div className={styles.triangle}></div>
      </button>
      <p className={styles.description}>{list.content}</p>
      <ul className={styles.list}>
        {list.geoIds &&
          list.geoIds.map((item) => (
            <li className={styles.item} key={item}>
              {`${item} tract`}
            </li>
          ))}
      </ul>
    </div>
  );
}
