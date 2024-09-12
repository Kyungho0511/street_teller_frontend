import { useState } from 'react';
import DropdownList from './DropdownList';
import { ClusterCheckboxItem } from '../../constants/surveyConstants';

type DropdownManagerProps = {
  lists: ClusterCheckboxItem[];
  displayChart?: boolean; // display a chart for each list item.
  expandFirstList?: boolean; // expand the first list item by default.
  autoCollapse?: boolean; // only one list can be expanded at a time.
}

export default function DropdownManager({lists, displayChart, expandFirstList, autoCollapse}: DropdownManagerProps) {
  const [expandedLists, setExpandedLists] = useState<boolean[]>(() => {
    const expandedLists = new Array(lists.length).fill(false);
    if (expandFirstList) expandedLists[0] = true;
    return expandedLists;
  });

  const handleClick = (index: number, event: React.MouseEvent) => {
    const target = event.target as HTMLElement;

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
            displayChart
          />
        </div>
      ))}
    </div>
  );
  }

