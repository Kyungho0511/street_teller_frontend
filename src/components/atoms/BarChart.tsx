import styles from "./BarChart.module.css";
import { UnitType } from "../../constants/mapConstants";
import * as utils from "../../utils/utils";

type BarChartProps = {
  label: string;
  value: number;
  unit?: UnitType;
}

/**
 * Bar chart component displaying values with a label.
 */
export default function BarChart({ label, value, unit }: BarChartProps) {
  return (
    <>
      <p className={styles.text}>
        {label}: {unit ? utils.formatUnit(value, unit) : value}
      </p>
      <div className={styles.background}>
        <div
          className={styles.chart}
          style={{ width: `${Math.round(value * 100)}%` }}
        ></div>
      </div>
    </>
  );
}