import { useContext, useState } from "react";
import { Cluster } from "../../constants/surveyConstants";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import { PopupContext } from "../../context/PopupContext";
import { useLocation } from "react-router-dom";

export type DropDownListProps = {
  index: number;
  toggleList: (index: number) => void;
  expanded: boolean;
};

type DropdownManagerProps = {
  lists: Cluster[];
  listType: React.ElementType;
  expandFirstList?: boolean; // expand the first list item by default.
  autoCollapse?: boolean; // only one list can be expanded at a time.
};

/**
 * Dropdown manager component to manage dropdown list components.
 */
export default function DropdownManager({
  lists,
  listType: ListType,
  expandFirstList,
  autoCollapse,
}: DropdownManagerProps) {
  const { selectedCluster } = useContext(PopupContext);
  const [expandedLists, setExpandedLists] = useState<boolean[]>(() =>
    new Array(lists.length).fill(false)
  );
  const location = useLocation();

  // Expand the first list if requested.
  useEffectAfterMount(() => {
    if (expandFirstList)
      setExpandedLists((list) => list.map((_, i) => (i === 0 ? true : false)));
  }, [expandFirstList]);

  // Collapse all lists when page changes.
  useEffectAfterMount(() => {
    setExpandedLists(new Array(lists.length).fill(false));
  }, [location.pathname]);

  // Expand the selected cluster list.
  useEffectAfterMount(() => {
    if (selectedCluster == null) return;
    toggleList(selectedCluster);
  }, [selectedCluster]);

  const toggleList = (index: number) => {
    if (autoCollapse) {
      setExpandedLists((list) =>
        list.map((_, i) => (i === index ? !list[i] : false))
      );
    } else {
      setExpandedLists((list) =>
        list.map((_, i) => (i === index ? !list[i] : list[i]))
      );
    }
  };

  return (
    <div>
      {lists.map((list, index) => (
        <div key={index}>
          <ListType
            list={list}
            index={index}
            toggleList={toggleList}
            expanded={expandedLists[index]}
          />
        </div>
      ))}
    </div>
  );
}
