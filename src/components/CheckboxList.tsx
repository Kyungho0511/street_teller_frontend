import { useState } from "react";
import styles from "./CheckboxList.module.css";
import { Survey } from "../context/SurveyContext";

type CheckboxListProps = {
  name: string;
  list: string[];
  colorbox?: boolean;
  setSurveyContext?: (newSurvey: Survey) => void;
};

export default function CheckboxList({ name, list, colorbox, setSurveyContext }: CheckboxListProps) {
  const [checked, setChecked] = useState<boolean[]>(() =>
    new Array(list.length).fill(true)
  );

  // Handle uncontrolled checkbox change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newChecked = checked.map((item, i) => i === index ? event.target.checked : item)
    setChecked(newChecked);

    // Update survey context if setSurveyContext is provided
    // it only updates the Boroughs in the survey context
    // if (setSurveyContext) {
    //   setSurveyContext();
    // }
  }

  return (
    <form className={styles.form}>
      {list.map((item, index) => (
        <label className={styles.label} key={index}>
          <input
            className={styles.input}
            type="checkbox"
            name={name}
            value={item}
            checked={checked[index]}
            onChange={(event) => handleChange(event, index)}
          />
          <span className={styles.indicator}></span>
          <div className={styles.text}>
            {colorbox && <span className={styles.colorbox}></span>}
            {item}
          </div>
        </label>
      ))}
    </form>
  );
}
