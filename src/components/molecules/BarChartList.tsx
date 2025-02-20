import styles from "./BarChartList.module.css";
import BarChart from "../atoms/BarChart";
import * as utils from "../../utils/utils";
import { Centroid } from "../../constants/surveyConstants";

type BarChartDropdownListProps = {
  list: Centroid[];
};

/**
 * Bar chart list component for cluster centroids.
 */
export default function BarChartList({ list }: BarChartDropdownListProps) {
  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {list.map((item) => (
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
