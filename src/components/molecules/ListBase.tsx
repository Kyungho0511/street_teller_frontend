import { useContext } from "react";
import { RGBA } from "../../constants/mapConstants";
import Colorbox from "../atoms/Colorbox";
import styles from "./ListBase.module.css";
import { SurveyContext } from "../../context/SurveyContext";

type ListBaseProps = {
  surveyName: string;
  list: { name: string; content: string; id: string; color: RGBA }[];
};

/**
 * List component with a nestsed sublist.
 * @param surveyName Survey name of the checkbox list.
 * @param list List of items to be displayed.
 */
export default function ListBase({ surveyName, list }: ListBaseProps) {
  const { getReportSubList } = useContext(SurveyContext);

  return (
    <ul className={styles.list}>
      {list.map((item, index) => (
        <li key={item.id} className={styles.item}>
          <Colorbox label={item.name} color={item.color} fontSize={"1rem"} />
          <p className={styles.text}>{item.content}</p>

          <ul className={styles.subList}>
            {getReportSubList(index).map((item) => (
              <li key={item.id} className={styles.subItem}>
                <Colorbox
                  label={item.name}
                  color={item.color}
                  fontSize={"0.9rem"}
                />
                {/* <p className={styles.text}>{item.content}</p> */}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
