import styles from "./PopupText.module.css";
import { useContext } from "react";
import { GEOID } from "../../constants/mapConstants";
import { PopupContext } from "../../context/PopupContext";

type PopupTextClusterProps = {
  text: string;
};

/**
 * Text component for the popup section.
 */
export default function PopupTextCluster({ text }: PopupTextClusterProps) {
  const { properties } = useContext(PopupContext);

  return (
    <>
      <h4 className={styles.title}>
        {`${GEOID}: ${properties?.GEOID}`}
      </h4>
      <div className={styles.body}>
        <span className={styles.text}>{text}</span>
        <span className={styles.value}></span>
      </div>
    </>
  );
}