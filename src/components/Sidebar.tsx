// import ResponseBox from './ResponseBox';
import styles from './Sidebar.module.css';

export default function Sidebar({children}: {children: React.ReactNode}) {
  return (
    <aside className={styles.sidebar}>
      {children}
    </aside>
  );
}
