import styles from './Sidebar.module.css';

export const SIDEBAR_WIDTH = 380;

/**
 * Sidebar component that displays its children components.
 */
export default function Sidebar({children}: {children: React.ReactNode}) {
  return (
    <aside className={styles.sidebar} style={{width: SIDEBAR_WIDTH}}>
      {children}
    </aside>
  );
}
