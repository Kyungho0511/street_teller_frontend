import styles from "./Tooltip.module.css";

type TooltipProps = {
  text: string;
};

/**
 * Tooltip component for the icon description.
 */
export default function Tooltip({ text }: TooltipProps) {
  return <div className={styles.tooltip}>{text}</div>;
}
