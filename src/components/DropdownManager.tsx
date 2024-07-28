import { useState } from 'react';
import DropdownList, { DropdownListType } from './DropdownList';

type DropdownManagerProps = {
  lists: DropdownListType[];
  defaultItem: string;
  selectable?: boolean;
  autoCollapse?: boolean;
}

export default function DropdownManager({lists, defaultItem, selectable, autoCollapse}: DropdownManagerProps) {
  const [expandedLists, setExpandedLists] = useState<boolean[]>(() => new Array(lists.length).fill(false));
  const [selectedItem, setSelectedItem] = useState<string>(defaultItem);

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

    // selectable option allows users to select items in the list
    if (target.tagName === "P" && selectable) {
      setSelectedItem(target.textContent! as string);
    }
  };

  return (
    <div>
      {lists.map((list, index) => (
        <div key={index} onClick={(event) => handleClick(index, event)}>
          <DropdownList
            list={list}
            selectedItem={selectedItem}
            expanded={expandedLists[index]}
            spacer={index === expandedLists.length - 1 ? false : true}
          />
        </div>
      ))}
    </div>
  );
  }

