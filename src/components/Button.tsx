import styles from './Button.module.css'

type ButtonProps = {
  text: string;
  color: "grey" | "blue";
};

export default function Button({text, color}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${color === "grey" && styles.grey} ${
        color === "blue" && styles.blue
      }`}
    >
      {text}
    </button>
  );
}