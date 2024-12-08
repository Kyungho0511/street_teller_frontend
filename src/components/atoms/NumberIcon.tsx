import styles from "./NumberIcon.module.css";

type NumberIconProps = {
  number: number;
  selected: boolean;
  colorContrast?: "high" | "low";
};

/**
 * Icon component with a number label inside.
 */
export default function NumberIcon({
  number,
  selected,
  colorContrast = "low",
}: NumberIconProps) {
  return (
    <div
      className={`${styles.icon} ${selected && styles.selected} ${
        colorContrast === "low" ? styles.contrast_low : styles.contrast_high
      }`}
    >
      {number}
    </div>
  );
}
