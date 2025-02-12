import { Preference } from "../../constants/surveyConstants";
import styles from "./DraggableList.module.css";
import { Reorder } from "framer-motion";
import { useContext, useRef } from "react";
import NumberIcon from "../atoms/NumberIcon";
import Icon from "../atoms/Icon";
import { iconPaths } from "../../constants/IconConstants";
import { Survey, SurveyContext } from "../../context/SurveyContext";

type DraggableListProps = {
  surveyName: keyof Survey;
  list: Preference[];
  selectable?: boolean;
  displayIcon?: boolean;
  displayRanking?: boolean;
};

/**
 * Draggable list component.
 */
export default function DraggableList({
  surveyName,
  list,
  selectable,
  displayIcon,
  displayRanking,
}: DraggableListProps) {
  const { setSurvey } = useContext(SurveyContext);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleReorder = (result: Preference[]) => {
    if (setSurvey) {
      // Update ranking of preferences based on index
      result.forEach((item, index) => {
        item.ranking = index + 1;
      });
      // Update Preferences in the survey context
      setSurvey((prev) => ({
        ...prev,
        [surveyName]: { ...prev[surveyName], list: result },
      }));
    }
  };

  const handleClick = (
    event: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    if (!selectable) return;

    // Highlight the selected item.
    const target = event.currentTarget as HTMLDivElement;
    itemRefs.current.forEach((item) => item?.classList.remove(styles.selected));
    target.classList.add(styles.selected);

    // Update preferences selected property in the SurveyContext.
    if (setSurvey) {
      const newPreferences = list.map((item, i) => {
        if (i === index) {
          return { ...item, selected: true };
        } else {
          return { ...item, selected: false };
        }
      });
      setSurvey((prev) => ({
        ...prev,
        [surveyName]: { ...prev[surveyName], list: newPreferences },
      }));
    }
  };

  return (
    <div className={styles.container}>
      <Reorder.Group
        axis="y"
        values={list}
        onReorder={(result) => handleReorder(result)}
      >
        {list.map((item, index) => (
          <Reorder.Item value={item} key={item.id}>
            <div
              ref={(element) => (itemRefs.current[index] = element)}
              className={`${styles.item} ${item.selected && styles.selected}`}
              onClick={(event) => handleClick(event, index)}
            >
              <div className={styles.category}>
                {displayRanking && (
                  <NumberIcon
                    number={item.ranking}
                    color="var(--color-dark-grey)"
                  />
                )}
                {displayIcon && <Icon path={item.iconPath} />}
                <span className={styles.text}>{item.category}</span>
              </div>

              <Icon path={iconPaths.dragHandle} />
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
