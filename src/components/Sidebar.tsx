import { Link } from 'react-router-dom';
import Logo from './Logo';
import styles from './Sidebar.module.css';

export default function Sidebar({children}: {children: React.ReactNode}) {
  return (
    <aside className={styles.sidebar}>
      <Link to="/">
        <Logo />
      </Link>
      {children}
    </aside>

    
  );
}
