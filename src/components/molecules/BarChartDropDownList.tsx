import styles from "./BarChartDropdownList.module.css";
import { Cluster } from "../../constants/surveyConstants";
import BarChart from "../atoms/BarChart";
import * as utils from "../../utils/utils";
import Colorbox from "../atoms/Colorbox";
import { DropdownManager } from "./DropdownManager";
import { DropdownListProps } from "./DropdownList";

type BarChartDropdownListProps = DropdownListProps & {
  list: Cluster;
};

/**
 * Bar chart drop down list component to be used with {@link DropdownManager} component.
 */
export default function BarChartDropdownList({
  list,
  index,
  toggleList,
  expanded,
}: BarChartDropdownListProps) {
  return (
    <div className={`${styles.container} ${expanded && styles.expanded}`}>
      <button className={styles.list_button} onClick={() => toggleList(index)}>
        <Colorbox label={list.name} color={list.color} />
        <div className={styles.spacer}></div>
        <div className={styles.triangle}></div>
      </button>
      <ul className={styles.list}>
        {list.centroids.map((item) => (
          <li className={styles.item} key={item.id}>
            <BarChart
              label={item.name}
              value={item.value}
              unit={utils.getUnit(item.name)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
