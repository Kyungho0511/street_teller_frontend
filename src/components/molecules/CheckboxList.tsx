import styles from "./CheckboxList.module.css";
import { useContext } from "react";
import { RGBA } from "../../constants/mapConstants";
import Colorbox from "../atoms/Colorbox";
import { Survey, SurveyContext } from "../../context/SurveyContext";
import { ReportSubList } from "../../constants/surveyConstants";

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
  subList?: ReportSubList[];
};

/**
 * Checkbox list component.
 * @param surveyName Survey name of the checkbox list.
 * @param list List of items to be displayed.
 */
export default function CheckboxList({
  surveyName,
  list,
  subList,
}: CheckboxListProps) {
  const { setSurvey } = useContext(SurveyContext);

  subList && console.log(subList);

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

  list.forEach((item, index) => console.log(index, item.id));

  return (
    <ul className={styles.list}>
      {list.map((item, index) => (
        <li key={item.id}>
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
            {subList &&
              subList[index] &&
              subList[index].map((item) => (
                <li className={styles.subItem} key={item.id}>
                  <div className={styles.subHeader}>
                    <Colorbox
                      label={item.name}
                      color={item.color}
                      fontSize={"0.8rem"}
                    />
                    <p className={styles.subLabel}>{item.name}</p>
                  </div>
                  <p className={styles.subText}>{item.content}</p>
                </li>
              ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
