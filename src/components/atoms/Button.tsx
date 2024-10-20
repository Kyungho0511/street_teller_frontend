import { useContext, useState } from "react";
import styles from "./Button.module.css";
import { MessageContext } from "../../context/MessageContext";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import { MapContext } from "../../context/MapContext";

type ButtonProps = {
  text: string;
  location: "sidebar" | "footbar";
  handleClick?: () => void;
};

export default function Button({ text, location, handleClick }: ButtonProps) {
  const { loadingMessage } = useContext(MessageContext);
  const { mapMode } = useContext(MapContext);
  
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
      } ${mapMode === "map" && styles.grey} ${mapMode === "satellite" && styles.blue}`}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}
