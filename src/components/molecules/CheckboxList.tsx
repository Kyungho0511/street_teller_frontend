import styles from "./CheckboxList.module.css";
import { BoroughList, ClusterCheckboxItem, ClusterList } from "../../constants/surveyConstants";
import Colorbox from "../atoms/Colorbox";
import { Hex } from "../../constants/mapConstants";

type CheckboxListProps = {
  name: string;
  list: CheckboxItem[];
  colorbox?: boolean;
  setSurveyContext: (newSurveyElement: BoroughList | ClusterList) => void;
};

export type CheckboxItem = {
  name: string;
  checked: boolean;
  id: string;
  color?: Hex;
}

export default function CheckboxList({ name, list, colorbox, setSurveyContext }: CheckboxListProps) {

  // Handle uncontrolled checkbox change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const updatedList = [...list];
      updatedList[index] = { ...updatedList[index], checked: event.target.checked };

      // Update Boroughs in the survey context
      if (name === "boroughs") {
        const newBoroughs: BoroughList = { name: "boroughs", list: updatedList};
        setSurveyContext(newBoroughs);
      } 
      
      // Update ClusterList in the survey context
      else if ([ "cluster1", "cluster2", "cluster3" ].includes(name)) {
        const newCluster: ClusterList = {
          name: name as "cluster1" | "cluster2" | "cluster3",
          list: updatedList as ClusterCheckboxItem[],
        };
        setSurveyContext(newCluster);
      }
  }

  return (
    <form className={styles.form}>
      {list.map((item, index) => (
        <label className={styles.label} key={item.id}>
          <input
            className={styles.input}
            type="checkbox"
            name={name}
            value={item.name}
            checked={item.checked}
            onChange={(event) => handleChange(event, index)}
          />
          <span className={styles.indicator}></span>
          {colorbox ? (
            <Colorbox label={item.name} color={item.color} fontSize={"1rem"} />
          ) : (
            <p className={styles.text}>{item.name}</p>
          )}
        </label>
      ))}
    </form>
  );
}
