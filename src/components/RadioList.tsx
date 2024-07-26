import styles from "./RadioList.module.css";

type RadioListProps = {
  name: string;
  labels: string[];
  values: string[];
};

export default function RadioList({ name, labels, values }: RadioListProps) {
  return (
    <div className={styles.list}>
      {labels.map((label, index) => (
        <label key={index} className={styles.label}>
          <input className={styles.input} type="radio" name={name} value={values[index]} />
          <span className={styles.indicator}></span>
          <div className={styles.text}>{label}</div>
        </label>
      ))}
    </div>
  );
}
