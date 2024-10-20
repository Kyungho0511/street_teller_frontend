import { useState } from "react";
import styles from "./Spacer.module.css";

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