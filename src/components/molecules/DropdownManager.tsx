import { useContext, useState } from "react";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import { MapQueryContext } from "../../context/MapQueryContext";
import { useLocation } from "react-router-dom";
import { ListItem } from "../../constants/surveyConstants";

type DropdownManagerProps = {
  lists: ListItem[];
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
  const { selectedCluster, selectedReport } = useContext(MapQueryContext);
  const [expandedLists, setExpandedLists] = useState<boolean[]>(() =>
    new Array(lists.length).fill(false)
  );
  const location = useLocation();

  useEffectAfterMount(() => {
    setExpandedLists(new Array(lists.length).fill(false));
  }, [lists.length]);

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

  // Expand the selected report list.
  useEffectAfterMount(() => {
    if (selectedReport == null) return;
    toggleList(selectedReport);
  }, [selectedReport]);

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
