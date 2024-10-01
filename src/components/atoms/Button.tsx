import { useContext, useState } from "react";
import styles from "./Button.module.css";
import { MessageContext } from "../../context/MessageContext";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";

type ButtonProps = {
  text: string;
  color: "grey" | "blue";
  location: "sidebar" | "footbar";
  handleClick?: () => void;
};

export default function Button({ text, color, location, handleClick }: ButtonProps) {
  // Global states
  const { loadingMessage } = useContext(MessageContext);

  //Local states
  const [disabled, setDisabled] = useState<boolean>(
    () => loadingMessage.text || loadingMessage.json
  );

  useEffectAfterMount(() => {
    setDisabled(loadingMessage.text || loadingMessage.json);
  }, [loadingMessage]);

  return (
    <button
      disabled={disabled}
      className={`${styles.button} ${
        location === "sidebar" ? styles.sidebar_button : styles.footbar_button
      } ${color === "grey" && styles.grey} ${color === "blue" && styles.blue}`}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}
