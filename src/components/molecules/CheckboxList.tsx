import styles from "./CheckboxList.module.css";
import { BoroughList } from "../../constants/surveyConstants";
import { Hex } from "../../constants/mapConstants";

type CheckboxListProps = {
  name: string;
  list: CheckboxItem[];
  setSurveyContext?: (newSurveyElement: BoroughList) => void;
};

export type CheckboxItem = {
  name: string;
  checked: boolean;
  id: string;
  color?: Hex;
  reasoning?: string;
}

/**
 * Checkbox list component for clusters and broughs selections.
 */
export default function CheckboxList({ name, list, setSurveyContext }: CheckboxListProps) {

  // Handle uncontrolled checkbox change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const updatedList = [...list];
      updatedList[index] = { ...updatedList[index], checked: event.target.checked };

      setSurveyContext &&  setSurveyContext({ name: "boroughs", list: updatedList});
  }

  return (
    <ul className={styles.list}>
      {list.map((item, index) => (
        <li key={item.id}>
          <label className={styles.label} >
            <input
              className={styles.input}
              type="checkbox"
              name={name}
              value={item.name}
              checked={item.checked}
              onChange={(event) => handleChange(event, index)}
            />
            <span className={styles.indicator}></span>
              <p>{item.name}</p>
          </label>
        </li>
      ))}
    </ul>
  );
}