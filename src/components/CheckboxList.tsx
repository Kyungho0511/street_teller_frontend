import { useState } from "react";
import styles from "./CheckboxList.module.css";

type CheckboxListProps = {
  name: string;
  list: CheckboxItem[];
};

export type CheckboxItem = {
  text: string;
  value: string;
};

export default function CheckboxList({ name, list }: CheckboxListProps) {
  const [checked, setChecked] = useState<boolean[]>(() =>
    new Array(list.length).fill(true)
  );

  // Handle uncontrolled checkbox change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newChecked = checked.map((item, i) => i === index ? event.target.checked : item)
    setChecked(newChecked);
  }

  return (
    <form className={styles.form}>
      {list.map((item, index) => (
        <label className={styles.label} key={index}>
          <input
            className={styles.input}
            type="checkbox"
            name={name}
            value={item.value}
            checked={checked[index]}
            onChange={(event) => handleChange(event, index)}
          />
          <span className={styles.indicator}></span>
          <div className={styles.text}>
            <span className={styles.colorbox}></span>
            {item.text}
          </div>
        </label>
      ))}
    </form>
  );
}
