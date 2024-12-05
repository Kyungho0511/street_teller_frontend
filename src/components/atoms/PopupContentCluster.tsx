import styles from "./PopupContent.module.css";
import { useContext, useState } from "react";
import { PopupContext } from "../../context/PopupContext";
import ClusterPage from "../../pages/ClusterPage";
import * as utils from "../../utils/utils";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";

type PopupContentClusterProps = {
  text: string;
};

/**
 * Popup text component for the {@link ClusterPage}
 */
export default function PopupContentCluster({
  text,
}: PopupContentClusterProps) {
  const { properties } = useContext(PopupContext);
  const [countyName, setCountyName] = useState<string>("");
  const [neighborhoodName, setNeighborhoodName] = useState<string>("");

  useEffectAfterMount(() => {
    if (!properties) return;
    const geoid = properties.GEOID.toString();
    setCountyName(utils.getCountyName(geoid));
    setNeighborhoodName(utils.getNeighborhoodName(geoid));
  }, [properties]);

  return (
    <>
      <p className={styles.title}>{`${neighborhoodName}, ${countyName}`}</p>
      <div className={styles.body}>
        <span className={styles.text}>{text}</span>
        <span className={styles.value}></span>
      </div>
    </>
  );
}
