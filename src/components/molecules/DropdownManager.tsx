import { useState } from 'react';
import DropdownList from './DropdownList';
import { ClusterCheckboxItem } from '../../constants/surveyConstants';

type DropdownManagerProps = {
  lists: ClusterCheckboxItem[];
  autoCollapse?: boolean;
}

export default function DropdownManager({lists, autoCollapse}: DropdownManagerProps) {
  const [expandedLists, setExpandedLists] = useState<boolean[]>(() => new Array(lists.length).fill(false));

  const handleClick = (index: number, event: React.MouseEvent) => {
    const target = event.target as HTMLElement;

    // autoCollapse option makes sure only one list is expanded at a time
    if (target.tagName === "BUTTON") {
      if (autoCollapse) {
        setExpandedLists((list) =>
          list.map((_, i) => (i === index ? !list[i] : false))
        );
      } else {
        setExpandedLists((list) =>
          list.map((_, i) => (i === index ? !list[i] : list[i]))
        );
      }
    }
  };

  return (
    <div>
      {lists.map((list, index) => (
        <div key={list.id} onClick={(event) => handleClick(index, event)}>
          <DropdownList
            list={list}
            expanded={expandedLists[index]}
          />
        </div>
      ))}
    </div>
  );
  }

