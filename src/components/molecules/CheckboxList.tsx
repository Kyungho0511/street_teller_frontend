import { useContext } from "react";
import { RGBA } from "../../constants/mapConstants";
import Colorbox from "../atoms/Colorbox";
import styles from "./CheckboxList.module.css";
import { v4 as uuidv4 } from "uuid";
import { Survey, SurveyContext } from "../../context/SurveyContext";

export type CheckboxItem = {
  name: string;
  content: string;
  color: RGBA;
  checked: boolean;
};

type CheckboxListProps = {
  surveyName: keyof Survey;
  list: CheckboxItem[];
};

/**
 * Checkbox list component.
 * @param surveyName Survey name of the checkbox list.
 * @param list List of items to be displayed.
 */
export default function CheckboxList({ surveyName, list }: CheckboxListProps) {
  const { setSurvey } = useContext(SurveyContext);

  // Handle uncontrolled checkbox change
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedList = [...list];
    updatedList[index] = {
      ...updatedList[index],
      checked: event.target.checked,
    };

    setSurvey((prev) => ({
      ...prev,
      [surveyName]: { ...prev[surveyName], list: updatedList },
    }));
  };

  return (
    <ul className={styles.list}>
      {list.map((item, index) => (
        <li key={uuidv4()}>
          <label className={styles.label}>
            <input
              className={styles.input}
              type="checkbox"
              name={surveyName}
              value={item.name}
              checked={item.checked}
              onChange={(event) => handleChange(event, index)}
            />
            <span className={styles.indicator}></span>
            <Colorbox label={item.name} color={item.color} fontSize={"1rem"} />
          </label>
          <div className={styles.text}>{item.content}</div>
        </li>
      ))}
    </ul>
  );
}
