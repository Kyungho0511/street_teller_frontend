import { FOOTBAR_HEIGHT } from "./Footbar";
import styles from "./LegendSection.module.css";
import { MAP_CONTROLS_HEIGHT } from "./MapControls";
import Icon from "../atoms/Icon";
import { iconPaths } from "../../constants/IconConstants";

type LegendSectionProps = {
  children: React.ReactNode;
  title: string;
  onClose?: () => void;
  alwaysVisible?: boolean;
};

/**
 * Container component to display the legend of the current analysis.
 */
export default function LegendSection({
  children,
  title,
  onClose,
  alwaysVisible,
}: LegendSectionProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header_content}>
          {title && <h4 className={styles.title}>{title}</h4>}
        </div>
        {!alwaysVisible && (
          <div className={styles.closeButton} onClick={onClose}>
            <Icon path={iconPaths.close} color="var(--color-dark-grey)" />
          </div>
        )}
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
