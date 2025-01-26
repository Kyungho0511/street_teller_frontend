import { useContext, useState } from "react";
import DropdownList from "./DropdownList";
import { Cluster } from "../../constants/surveyConstants";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import { PopupContext } from "../../context/PopupContext";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

type DropdownManagerProps = {
  lists: Cluster[];
  displayChart?: boolean; // display a chart for each list item.
  displayColorbox?: boolean; // display a color box for each list item.
  expandFirstList?: boolean; // expand the first list item by default.
  autoCollapse?: boolean; // only one list can be expanded at a time.
};

/**
 * Dropdown manager component to manage {@link DropdownList} components.
 */
export default function DropdownManager({
  lists,
  displayChart,
  displayColorbox,
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
        <div key={uuidv4()}>
          <DropdownList
            list={list}
            index={index}
            toggleList={toggleList}
            expanded={expandedLists[index]}
            displayChart={displayChart}
            displayColorbox={displayColorbox}
          />
        </div>
      ))}
    </div>
  );
}
