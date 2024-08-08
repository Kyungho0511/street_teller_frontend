import styles from './Logo.module.css';

export default function Logo() {
  return (
    <div className={styles.container}>
      <img
        src="src/assets/images/neighbor_teller_logo.png"
        alt="logo_image"
        className={styles.logo}
      />
    </div>
  );
}