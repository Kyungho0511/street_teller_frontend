import React from 'react';
import styles from './SidebarSection.module.css';

type SidebarSectionProps = {
  children: React.ReactNode;
  title?: string;
  subtitles?: string[];
};

/**
 * Container component to display the sidebar section.
 */
export default function SidebarSection({ children, title, subtitles }: SidebarSectionProps) {
  return (
    <div className={styles.section}>
      {title && <h4 className={styles.title}>{title}</h4>}
      {subtitles &&
        subtitles.map((subtitle, index) => (
          <h4 className={styles.subtitle} key={index}>
            {subtitle}
          </h4>
        ))}
      {children}
    </div>
  );
}