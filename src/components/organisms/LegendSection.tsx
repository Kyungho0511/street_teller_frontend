import { FOOTBAR_HEIGHT } from "./Footbar";
import styles from "./LegendSection.module.css";
import { MAP_CONTROLS_HEIGHT } from "./MapControls";
import Icon from "../atoms/Icon";
import { iconPaths } from "../../constants/IconConstants";
import { useEffect } from "react";
import { RGBA } from "../../constants/mapConstants";
import Colorbox from "../atoms/Colorbox";

type LegendSectionProps = {
  children: React.ReactNode;
  title?: string;
  titleColor?: RGBA;
  visible?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
};

/**
 * Container component to display the legend of the current analysis.
 */
export default function LegendSection({
  children,
  title,
  titleColor,
  visible = true,
  onClose,
  onOpen,
}: LegendSectionProps) {
  // Call onOpen callback function on component mount.
  useEffect(() => {
    onOpen && visible && onOpen();
  }, [visible]);

  return (
    <div
      className={styles.container}
      style={{ visibility: visible ? "visible" : "hidden" }}
    >
      <div className={styles.header}>
        <div className={styles.header_content}>
          {title && titleColor && (
            <Colorbox
              label={title}
              color={titleColor}
              fontSize="1.1rem"
              fontWeight="var(--font-bold)"
              capitalize
            />
          )}
          {title && !titleColor && <h4 className={styles.title}>{title}</h4>}
        </div>
        {onClose && (
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
