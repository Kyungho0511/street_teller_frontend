import { useState } from "react";
import styles from "./Spacer.module.css";

/**
 * Spacer component to create a space between elements.
 */
export default function Spacer({ hidden }: { hidden?: boolean }) {
  const [isVisible] = useState<boolean>(hidden ? false : true);

  return (
    <div className={styles.container}>
      <hr
        className={styles.spacer}
        style={{ visibility: isVisible ? "visible" : "hidden" }}
      />
    </div>
  );
}