import styles from "./CheckboxList.module.css";
import { CheckboxItem } from "../../constants/surveyConstants";
import { v4 as uuidv4 } from "uuid";

type CheckboxListProps = {
  page: string;
  list: CheckboxItem[];
};

/**
 * Checkbox list component.
 * @param page Page name that contains the checkbox list.
 * @param list List of items to be displayed.
 */
export default function CheckboxList({ page, list }: CheckboxListProps) {
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
  };

  return (
    <ul className={styles.list}>
      {list.map((item, index) => (
        <li key={uuidv4()}>
          <label className={styles.label}>
            <input
              className={styles.input}
              type="checkbox"
              name={page}
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
