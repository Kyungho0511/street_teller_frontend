import NumberIcon from "../atoms/NumberIcon";
import { FOOTBAR_HEIGHT } from "./Footbar";
import styles from "./LegendSection.module.css";
import React from "react";
import { MAP_CONTROLS_HEIGHT } from "./MapControls";

type LegendSectionProps = {
  children: React.ReactNode;
  title?: string;
  steps?: number[];
  currentStep?: number;
};

/**
 * Container component to display the legend of the current analysis.
 */
export default function LegendSection({
  children,
  title,
  steps,
  currentStep,
}: LegendSectionProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header_content}>
          {title && <h4 className={styles.title}>{title}</h4>}
          {steps &&
            steps.map((step, index) => (
              <div key={index}>
                <NumberIcon
                  number={step}
                  selected={step === currentStep}
                  colorContrast="high"
                />
              </div>
            ))}
        </div>
      </div>
      <div
        className={styles.body}
        style={{
          maxHeight: `calc(100vh - ${
            FOOTBAR_HEIGHT + MAP_CONTROLS_HEIGHT
          }px - 5rem)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
