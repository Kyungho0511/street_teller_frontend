import styles from "./NumberIcon.module.css";

type NumberIconProps = {
  label: number;
  selected: boolean;
};

/**
 * Icon component with a number label inside.
 */
export default function NumberIcon({ label, selected }: NumberIconProps) {
  return (
    <div className={`${styles.icon} ${selected && styles.selected}`}>
      {label}
    </div>
  );
}
