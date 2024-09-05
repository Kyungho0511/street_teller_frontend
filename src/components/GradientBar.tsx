import styles from "./GradientBar.module.css";
import { MapBound, UnitType } from "../constants/mapConstants";
import * as utilities from "../services/utilities";

type GradientBarProps = {
  bound: MapBound;
  unit: UnitType;
}

export default function GradientBar({ bound, unit }: GradientBarProps) {
  const scaleMin: string = utilities.formatUnit(bound.min, unit);
  const scaleMax: string = utilities.formatUnit(bound.max, unit);

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
