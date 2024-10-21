import styles from "./LegendSection.module.css";
import React from "react";

type LegendSectionProps = {
  children: React.ReactNode;
  title?: string;
  steps?: number[];
  currentStep?: number;
}

/**
 * Container component to display the legend of the current analysis.
 */
export default function LegendSection({ children, title, steps, currentStep }: LegendSectionProps) {

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header_content}>
          {title && <h4 className={styles.title}>{title}</h4>}
          {steps &&
            steps.map((step, index) => (
              <div
                className={`${styles.step_icon} ${step === currentStep && styles.current}`}
                key={index}
              >
                {step}
              </div>
            ))}
        </div>
      </div>
      <div className={styles.body}>
        {/* scroller implements a rounded scrollbar */}
        <div className={styles.scroller}>
          {children}
        </div>
      </div>
    </div>
  );
}