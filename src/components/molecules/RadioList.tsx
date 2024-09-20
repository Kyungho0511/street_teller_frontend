import { useState } from "react";
import styles from "./RadioList.module.css";

type RadioListProps = {
  name: string;
  list: string[];
};

export default function RadioList({ name, list }: RadioListProps) {
const [checked, setChecked] = useState<boolean[]>(() => new Array(list.length).fill(false));

  // Handle uncontrolled radio change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newChecked = checked.map((_, i) => i === index ? event.target.checked : false)
    setChecked(newChecked);
  }

  return (
    <form className={styles.form}>
      {list.map((item, index) => (
        <label key={index} className={styles.label}>
          <input
            className={styles.input}
            type="radio"
            name={name}
            value={item}
            checked={checked[index]}
            onChange={(event) => handleChange(event, index)}
          />
          <span className={styles.indicator}></span>
          <div className={styles.text}>{item}</div>
        </label>
      ))}
    </form>
  );
}
