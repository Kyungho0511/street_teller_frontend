import styles from "./GradientBar.module.css";
import { MapBound, UnitType } from "../../constants/mapConstants";
import * as utils from "../../utils/utils";

type GradientBarProps = {
  bound: MapBound;
  unit: UnitType;
}

/**
 * Component to display the gradient scale of the current analysis.
 */
export default function GradientBar({ bound, unit }: GradientBarProps) {
  const scaleMin: string = utils.formatUnit(bound.min, unit);
  const scaleMax: string = utils.formatUnit(bound.max, unit);

  return (
    <div className={styles.container}>
      <div className={styles.bar}></div>
      <div className={styles.scale}>
        <span>{scaleMin}</span>
        <span>{scaleMax}</span>
      </div>
    </div>
  );
}
