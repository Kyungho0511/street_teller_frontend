import styles from './PromptBox.module.css';

export default function PromptBox() {
  return(
    <form className={styles.form}>
      <input className={styles.input} type="text" placeholder="Ask SiteTeller" />
      <button className={styles.button} type="submit">icon</button>
    </form>       
  );
}