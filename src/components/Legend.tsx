import styles from './Legend.module.css';

export default function Legend() {
  return (
    <div className={styles.container}>
      <h2>Legend</h2>
      <ul>
        <li>Red: High</li>
        <li>Yellow: Medium</li>
        <li>Green: Low</li>
        <li>Green: Low</li>
        <li>Green: Low</li>
        <li>Green: Low</li>
      </ul>
    </div>
  );
}