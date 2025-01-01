import styles from "./NumberIcon.module.css";

type NumberIconProps = {
  number: number;
  color?: string;
  selected?: boolean;
  colorContrast?: "high" | "low";
};

/**
 * Icon component with a number label inside.
 */
export default function NumberIcon({
  number,
  color,
  selected = false,
  colorContrast = "low",
}: NumberIconProps) {
  return (
    <div
      className={`${styles.icon} ${selected && styles.selected} ${
        colorContrast === "low" ? styles.contrast_low : styles.contrast_high
      }`}
      style={{ backgroundColor: color }}
    >
      {number}
    </div>
  );
}
