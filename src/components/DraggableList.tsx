import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Boroughs, Preferences } from '../constants/type';
import styles from './DraggableList.module.css';
import { faGripLines } from '@fortawesome/free-solid-svg-icons';

type DraggableListProps = {
  list: Preferences['list'];
  setSurveyContext?: (newSurveyElement: Boroughs | Preferences) => void;
  displayIcon?: boolean;
};

export default function DraggableList({list, setSurveyContext, displayIcon}: DraggableListProps) {

    // // Handle uncontrolled checkbox change
    // const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {

    //   // Update Boroughs in the survey context
    //   if (setSurveyContext) {
    //     const updatedList = [...list] as Boroughs['list'];
    //     updatedList[index] = { ...updatedList[index], checked: event.target.checked };
  
    //     const newBoroughs: Boroughs = { name: "boroughs", list: updatedList };
    //     setSurveyContext(newBoroughs);
    //   }
    // }

  return (
    <ul className={styles.list}>
      {list.map((item, index) => (
        <div>
          <li className={styles.item} key={index}>
            <div className={styles.category}>
              {displayIcon && <FontAwesomeIcon icon={item.icon} className={styles.icon}/>}
              <span className={styles.text}>{item.category}</span>
            </div>
            <FontAwesomeIcon icon={faGripLines} />
          </li>
          {/* place a spacer between items */}
          {index !== (list.length -1) && <hr className='spacer' />}
        </div>
      ))}
    </ul>
  );
}