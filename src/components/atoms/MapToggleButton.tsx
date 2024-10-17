import { useContext, useState } from "react";
import styles from "./MapToggleButton.module.css";
import { MessageContext } from "../../context/MessageContext";
import { MapContext } from "../../context/MapContext";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";

export default function MapToggleButton() {
  const { loadingMessage } = useContext(MessageContext);
  const { satelliteMode, setSatelliteMode } = useContext(MapContext);

  const [disabled, setDisabled] = useState<boolean>(
    () => loadingMessage.text || loadingMessage.json
  );

  useEffectAfterMount(() => {
    setDisabled(loadingMessage.text || loadingMessage.json);
  }, [loadingMessage]);

  const handleClick = () => {
    setSatelliteMode(!satelliteMode);
  };

  return (
    <button
      disabled={disabled}
      className={styles.button}
      onClick={handleClick}
    >
      <p className={styles.text}>{satelliteMode ? "Map" : "Satellite"}</p>
    </button>
  );
}
