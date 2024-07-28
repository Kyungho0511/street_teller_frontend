import styles from "./Button.module.css";

type ButtonProps = {
  text: string;
  color: "grey" | "blue";
  location: "sidebar" | "footbar";
};

export default function Button({ text, color, location }: ButtonProps) {
  return (
    <button
      className={`${
        location === "sidebar" ? styles.sidebar_button : styles.footbar_button
      } ${color === "grey" && styles.grey} ${color === "blue" && styles.blue}`}
    >
      {text}
    </button>
  );
}
