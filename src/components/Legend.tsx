import { useContext } from 'react';
import styles from './Legend.module.css';
import { MessageContext } from '../context/MessageContext';

export default function Legend() {
  const {messages} = useContext(MessageContext);

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Legend</h4>
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