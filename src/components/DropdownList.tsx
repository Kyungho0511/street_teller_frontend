import styles from './DropdownList.module.css';

type DropdownListProps = {
  list: DropdownListType;
  selectedItem?: string;
  expanded: boolean;
  spacer: boolean;
}

export type DropdownListType = {
  category: string;
  items: string[];
}

export default function DropdownList({list, selectedItem, expanded, spacer}: DropdownListProps) {
  return (
    <div className={`${expanded && styles.expanded}`}>
      <button className={styles.button}>
        <span className={styles.triangle}></span>{list.category}
      </button>
      {/* ul --> className="dataset__list" */}
      <ul className={styles.list}> 
        {list.items.map((item, index) => (
          <li className={`${styles.item} ${selectedItem === item && styles.selectedItem}`} key={index}>
            <p>{item}</p>
            <i className="fa-regular fa-square-plus"></i>
          </li>
        ))}
      </ul>
      {spacer && <hr className={styles.spacer} />}
    </div>
  )
}