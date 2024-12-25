import styles from "./Tooltip.module.css";

type TooltipProps = {
  text: string;
  offset?: {
    x: number;
    y: number;
  };
};

/**
 * Tooltip component for the icon description.
 */
export default function Tooltip({ text, offset }: TooltipProps) {
  return (
    <div
      className={styles.tooltip}
      style={
        offset && {
          transform: `translateX(calc(-50% + ${offset.x}px)) translateY(${offset.y}px)`,
        }
      }
    >
      {text}
      <div
        className={styles.arrow}
        style={
          offset && {
            transform: `translateX(calc(-50% + ${-offset.x}px)) translateY(${-offset.y}px)`,
          }
        }
      ></div>
    </div>
  );
}
