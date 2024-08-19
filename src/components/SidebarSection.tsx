import React from 'react';
import styles from './SidebarSection.module.css';

type SidebarSectionProps = {
  children: React.ReactNode;
  title?: string;
};

export default function SidebarSection({ children, title }: SidebarSectionProps) {
  return (
    <div className={styles.section}>
      {title && <h4 className={styles.title}>{title}</h4>}
      {children}
    </div>
  )
}