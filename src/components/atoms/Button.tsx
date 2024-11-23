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

/**
 * Button component with bold text.
 */
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
      // TODO: refactor conditional styles with theme.css variables.
      className={`${styles.button} ${
        location === "sidebar" ? styles.sidebar_button : styles.footbar_button
      } ${
        mapMode === "satellite" && location === "footbar"
          ? styles.blue
          : styles.grey
      }`}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}
