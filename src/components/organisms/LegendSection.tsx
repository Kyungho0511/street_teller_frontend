import { FOOTBAR_HEIGHT } from "./Footbar";
import styles from "./LegendSection.module.css";
import React from "react";
import { MAP_CONTROLS_HEIGHT } from "./MapControls";
import useNameFromMap from "../../hooks/useNameFromMap";

type LegendSectionProps = {
  children: React.ReactNode;
  title?: string;
  useTitleFromMap?: boolean;
};

/**
 * Container component to display the legend of the current analysis.
 */
export default function LegendSection({
  children,
  title,
  useTitleFromMap,
}: LegendSectionProps) {
  const [countyName, neighborhoodName] = useNameFromMap();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header_content}>
          {title && <h4 className={styles.title}>{title}</h4>}
          {useTitleFromMap && (
            <h4
              className={styles.title}
            >{`${neighborhoodName}, ${countyName}`}</h4>
          )}
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
