import { v4 as uuidv4 } from "uuid";
import styles from './DropdownList.module.css';
import { ClusterCheckboxItem } from '../../constants/surveyConstants';
import BarChart from "../atoms/BarChart";
import * as utils from "../../utils/utils";

type DropdownListProps = {
  list: ClusterCheckboxItem;
  displayChart?: boolean; // display a chart for each list item.
  expanded?: boolean;
}

export default function DropdownList({list, displayChart, expanded}: DropdownListProps) {
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
            {/* <p>{item.name}: {item.value}</p> */}
            {displayChart && <BarChart label={item.name} value={item.value} unit={utils.getUnit(item.name)} />}
          </li>
        ))}
      </ul>
    </div>
  )
}