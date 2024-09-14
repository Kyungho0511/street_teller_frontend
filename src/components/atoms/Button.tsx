import styles from "./Button.module.css";

type ButtonProps = {
  text: string;
  color: "grey" | "blue";
  location: "sidebar" | "footbar";
  handleClick?: () => void;
};

export default function Button({ text, color, location, handleClick }: ButtonProps) {
  return (
    <button
      className={`${
        location === "sidebar" ? styles.sidebar_button : styles.footbar_button
      } ${color === "grey" && styles.grey} ${color === "blue" && styles.blue}`}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}
