import { useContext, useState } from "react";
import styles from "./Button.module.css";
import { MessageContext } from "../../context/MessageContext";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import { MapContext } from "../../context/MapContext";

type ButtonProps = {
  text: string;
  type: "sidebar" | "footbar";
  handleClick?: () => void;
};

/**
 * Button component with bold text.
 */
export default function Button({ text, type, handleClick }: ButtonProps) {
  const { isStreaming } = useContext(MessageContext);
  const { mapMode } = useContext(MapContext);

  const [disabled, setDisabled] = useState<boolean>(
    () => isStreaming.text || isStreaming.json
  );

  useEffectAfterMount(() => {
    setDisabled(isStreaming.text || isStreaming.json);
  }, [isStreaming]);

  return (
    <button
      disabled={disabled}
      // TODO: refactor conditional styles with theme.css variables.
      className={`${styles.button} ${
        type === "sidebar" ? styles.sidebar_button : styles.footbar_button
      } ${
        mapMode === "satellite" && type === "footbar"
          ? styles.blue
          : styles.grey
      }`}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}
