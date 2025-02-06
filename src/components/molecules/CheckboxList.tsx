import styles from "./CheckboxList.module.css";
import { useContext } from "react";
import { RGBA } from "../../constants/mapConstants";
import Colorbox from "../atoms/Colorbox";
import { Survey, SurveyContext } from "../../context/SurveyContext";

export type CheckboxItem = {
  name: string;
  content: string;
  color: RGBA;
  checked: boolean;
  id: string;
};

type CheckboxListProps = {
  surveyName: keyof Survey;
  list: CheckboxItem[];
};

/**
 * Checkbox list component with a nested sublist.
 * @param surveyName Survey name of the checkbox list.
 * @param list List of items to be displayed.
 */
export default function CheckboxList({ surveyName, list }: CheckboxListProps) {
  const { setSurvey, getReportSubList } = useContext(SurveyContext);

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
        <li key={item.id} className={styles.item}>
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
          <p className={styles.text}>{item.content}</p>

          <ul className={styles.subList}>
            {surveyName === "report" &&
              getReportSubList(index).map((item) => (
                <li className={styles.subItem} key={item.id}>
                  <Colorbox
                    label={item.name}
                    color={item.color}
                    fontSize={"0.9rem"}
                  />
                  {/* <p className={styles.subText}>{item.content}</p> */}
                </li>
              ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
