import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Preferences } from '../constants/homeConstants';
import styles from './DraggableList.module.css';
import { faGripLines } from '@fortawesome/free-solid-svg-icons';
import { Reorder } from 'framer-motion';

type DraggableListProps = {
  list: Preferences['list'];
  setSurveyContext?: (newSurveyElement: Preferences) => void;
  displayIcon?: boolean;
};

export default function DraggableList({list, setSurveyContext, displayIcon}: DraggableListProps) {

  const handleReorder = (result: Preferences['list']) => {

      // Update Boroughs in the survey context
      if (setSurveyContext) {
        const newPreferences: Preferences = { name: "preferences", list: result };
        setSurveyContext(newPreferences);
      }
    }

  return (
      <Reorder.Group axis="y" values={list} onReorder={(result) => handleReorder(result)}>
        {list.map((item, index) => (
          <Reorder.Item value={item} key={item.id}>
            <div className={styles.item}>
              <div className={styles.category}>
                {displayIcon && <FontAwesomeIcon icon={item.icon} className={styles.icon}/>}
                <span className={styles.text}>{item.category}</span>
              </div>
              <FontAwesomeIcon icon={faGripLines} />
            </div>
            {/* place a spacer between items */}
            {index !== (list.length -1) && <hr className='spacer' />}
          </Reorder.Item>
        ))}
      </Reorder.Group>
  );
}