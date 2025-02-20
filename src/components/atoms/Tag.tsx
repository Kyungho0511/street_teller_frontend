import styles from "./Tag.module.css";

type TagProps = {
  text: string;
  position: "top-left" | "top-right";
};

/**
 * Tag component.
 */
export default function Tag({ text, position }: TagProps) {
  return (
    <div
      className={styles.tag}
      style={
        position === "top-left"
          ? { top: "0.5rem", left: "0.5rem" }
          : { top: "0.5rem", right: "0.5rem" }
      }
    >
      <p className={styles.text}>{text}</p>
    </div>
  );
}
