import styles from "./LegendSection.module.css";
import React from "react";

type LegendSectionProps = {
  children: React.ReactNode;
  title?: string;
}

export default function LegendSection({children, title}: LegendSectionProps) {

  return (
    <div className={styles.container}>
      {title && <h4 className={styles.title}>{title}</h4>}
      {children}
    </div>
  );
}
