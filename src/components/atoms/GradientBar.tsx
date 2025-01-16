import styles from "./GradientBar.module.css";
import { MapAttribute, MapBound, UnitType } from "../../constants/mapConstants";
import * as utils from "../../utils/utils";
import { useContext } from "react";
import { PopupContext } from "../../context/PopupContext";

type GradientBarProps = {
  bound: MapBound;
  unit: UnitType;
  selectedAttribute: MapAttribute;
};

/**
 * Component to display the gradient scale of the current analysis.
 */
export default function GradientBar({
  bound,
  unit,
  selectedAttribute,
}: GradientBarProps) {
  const { property } = useContext(PopupContext);
  const value = property ? (property[selectedAttribute.name] as number) : null;
  const scaleMin = utils.formatUnit(bound.min, unit);
  const scaleMax = utils.formatUnit(bound.max, unit);
  // const scaleValue = value !== null ? utils.formatUnit(value, unit) : "";

  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        {value !== null && (
          <>
            {/* <div
              className={styles.value}
              style={{
                left: `${
                  ((value - bound.min) / (bound.max - bound.min)) * 100
                }%`,
              }}
            >
              {scaleValue}
            </div> */}
            <div
              className={styles.marker}
              style={{
                left: `${
                  ((value - bound.min) / (bound.max - bound.min)) * 100
                }%`,
              }}
            ></div>
          </>
        )}
      </div>

      <div className={styles.scale}>
        <span>{scaleMin}</span>
        <span>{scaleMax}</span>
      </div>
    </div>
  );
}
