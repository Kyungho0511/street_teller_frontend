import { v4 as uuidv4 } from "uuid";
import { ClusterCheckboxItem } from '../../constants/surveyConstants';
import styles from './DropdownList.module.css';

type DropdownListProps = {
  list: ClusterCheckboxItem;
  expanded?: boolean;
}

export default function DropdownList({list, expanded}: DropdownListProps) {
  return (
    <div className={`${styles.container} ${expanded && styles.expanded}`}>
      <button className={styles.list_button}>
        <span className={styles.triangle}></span>{list.name}
      </button>
      <ul className={styles.list}> 
        {list.centroids.map((item) => (
          <li 
            className={styles.text} 
            key={uuidv4()}
          >
            <p>{item.name}: {item.value}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}