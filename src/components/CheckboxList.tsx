import { useState } from "react";
import styles from "./CheckboxList.module.css";
import { Boroughs, Preferences } from "../constants/type";

export type CheckboxListProps = {
  name: string;
  list: Boroughs['list'];
  colorbox?: boolean;
  setSurveyContext?: (newSurveyElement: Boroughs | Preferences) => void;
};

export default function CheckboxList({ name, list, colorbox, setSurveyContext }: CheckboxListProps) {
  const [checked, setChecked] = useState<boolean[]>(() =>
    new Array(list.length).fill(true)
  );

  // Handle uncontrolled checkbox change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newChecked = checked.map((item, i) => i === index ? event.target.checked : item)
    setChecked(newChecked);

    // // Update Boroughs in the survey context
    // if (setSurveyContext) {
    //   const newList: Boroughs['list'] = list.map((item, index) => ({...item, checked: newChecked[index]}));
      
    //   const boroughs: Boroughs = 
    //   setSurveyContext(newList);
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
            value={item.borough}
            checked={item.checked}
            onChange={(event) => handleChange(event, index)}
          />
          <span className={styles.indicator}></span>
          <div className={styles.text}>
            {colorbox && <span className={styles.colorbox}></span>}
            {item.borough}
          </div>
        </label>
      ))}
    </form>
  );
}
