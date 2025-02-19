import styles from "./CheckboxList.module.css";
import { useContext } from "react";
import Colorbox from "../atoms/Colorbox";
import { Survey, SurveyContext } from "../../context/SurveyContext";
import { ListItem } from "../../constants/surveyConstants";
import Icon from "../atoms/Icon";
import { iconPaths } from "../../constants/IconConstants";
import { MapQueryContext } from "../../context/MapQueryContext";

type CheckboxListProps = {
  surveyName: keyof Survey;
  list: ListItem[];
  showInfo?: boolean;
  setInfo?: React.Dispatch<React.SetStateAction<number | undefined>>;
};

/**
 * Checkbox list component.
 * @param surveyName Survey name of the checkbox list.
 * @param list List of items to be displayed.
 * @param showInfo Flag to show the information icon on list items.
 * @param setInfo Callback function to set the selected information index.
 */
export default function CheckboxList({
  surveyName,
  list,
  showInfo = false,
  setInfo,
}: CheckboxListProps) {
  const { setSurvey } = useContext(SurveyContext);
  const { selectedClusterInfo } = useContext(MapQueryContext);

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
          <div className={styles.itemHeader}>
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
              <Colorbox
                label={item.name}
                color={item.color}
                fontSize={"1rem"}
              />
            </label>
            {showInfo && setInfo && (
              <div
                className={`${styles.icon} ${
                  selectedClusterInfo === index && styles.selected
                }`}
                onClick={() => setInfo(index)}
              >
                <Icon path={iconPaths.information} height={24} width={24} />
              </div>
            )}
          </div>

          <p className={styles.text}>{item.content}</p>
        </li>
      ))}
    </ul>
  );
}
