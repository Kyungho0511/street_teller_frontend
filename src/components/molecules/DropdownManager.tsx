import { useState } from 'react';
import DropdownList from './DropdownList';
import { ClusterCheckboxItem } from '../../constants/surveyConstants';
import useEffectAfterMount from '../../hooks/useEffectAfterMount';

type DropdownManagerProps = {
  lists: ClusterCheckboxItem[];
  displayChart?: boolean; // display a chart for each list item.
  displayColorbox?: boolean; // display a color box for each list item.
  expandFirstList?: boolean; // expand the first list item by default.
  autoCollapse?: boolean; // only one list can be expanded at a time.
}

export default function DropdownManager({
  lists,
  displayChart,
  displayColorbox,
  expandFirstList,
  autoCollapse,
}: DropdownManagerProps) {
  const [expandedLists, setExpandedLists] = useState<boolean[]>(() =>
    new Array(lists.length).fill(false)
  );

  useEffectAfterMount(() => {
    if (expandFirstList)
      setExpandedLists((list) => list.map((_, i) => (i === 0 ? true : false)));
  }, [expandFirstList]);

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
        <div key={list.id}>
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

