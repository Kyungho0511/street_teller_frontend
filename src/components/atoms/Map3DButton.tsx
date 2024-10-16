import { useContext, useState } from "react";
import styles from "./Map3DButton.module.css";
import { MessageContext } from "../../context/MessageContext";
import { MapContext } from "../../context/MapContext";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import { SIDEBAR_WIDTH } from "../organisms/Sidebar";

export default function Map3DButton() {
  const { loadingMessage } = useContext(MessageContext);
  const { is3DMode, setIs3DMode } = useContext(MapContext);

  const [disabled, setDisabled] = useState<boolean>(
    () => loadingMessage.text || loadingMessage.json
  );

  useEffectAfterMount(() => {
    setDisabled(loadingMessage.text || loadingMessage.json);
  }, [loadingMessage]);

  const handleClick = () => {
    setIs3DMode(!is3DMode);
  };

  return (
    <div className={styles.container} style={{ left: SIDEBAR_WIDTH }}>
      <button disabled={disabled} className={styles.button} onClick={handleClick}>
        {is3DMode ? "2D" : "3D"}
      </button>
    </div>
  );
}
