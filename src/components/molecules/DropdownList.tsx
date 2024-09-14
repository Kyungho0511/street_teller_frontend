import { v4 as uuidv4 } from "uuid";
import styles from './DropdownList.module.css';
import { ClusterCheckboxItem } from '../../constants/surveyConstants';
import BarChart from "../atoms/BarChart";
import * as utils from "../../utils/utils";
import Colorbox from "../atoms/Colorbox";

type DropdownListProps = {
  list: ClusterCheckboxItem;
  index: number;
  toggleList: (index: number) => void;
  expanded: boolean;
  displayChart?: boolean; // display a chart for each list item.
  displayColorbox?: boolean; // display a color box for each list item.
}

export default function DropdownList({
  list,
  index,
  toggleList: toggleList,
  expanded,
  displayChart,
  displayColorbox,
}: DropdownListProps) {

  return (
    <div className={`${styles.container} ${expanded && styles.expanded}`}>
      <button className={styles.list_button} onClick={() => toggleList(index)}>
        {displayColorbox && <Colorbox label={list.name} color={list.color} fontSize={"1rem"} />}
        <span className={styles.triangle}></span>
      </button>
      <ul className={styles.list}>
        {list.centroids.map((item) => (
          <li className={styles.item} key={uuidv4()}>
            {displayChart && (
              <BarChart
                label={item.name}
                value={item.value}
                unit={utils.getUnit(item.name)}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}