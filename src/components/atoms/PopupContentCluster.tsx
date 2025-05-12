import styles from "./PopupContent.module.css";
import { useContext } from "react";
import { MapQueryContext } from "../../context/MapQueryContext";
import ClusterPage from "../../pages/ClusterPage";
import Colorbox from "./Colorbox";
import useNameFromMap from "../../hooks/useNameFromMap";
import useFeatureFromMap from "../../hooks/useFeatureFromMap";
import useMapClickEvent from "../../hooks/useMapClickEvent";

type PopupContentClusterProps = {
  clusterId: string;
};

/**
 * Popup content component for the {@link ClusterPage}
 */
export default function PopupContentCluster({
  clusterId,
}: PopupContentClusterProps) {
  const { setSelectedCluster } = useContext(MapQueryContext);
  const { currentHoveredFeature } = useFeatureFromMap(clusterId);
  const { hoveredCountyName, hoveredNeighborhoodName } = useNameFromMap();

  // Set selected cluster based on the map mouse event.
  useMapClickEvent(`cluster${clusterId}`, setSelectedCluster);

  return (
    <>
      <p
        className={styles.title}
      >{`${hoveredNeighborhoodName}, ${hoveredCountyName}`}</p>
      <div className={styles.body}>
        {currentHoveredFeature && (
          <div className={styles.item}>
            <Colorbox
              label={currentHoveredFeature.name}
              color={currentHoveredFeature.color}
            />
            <div style={{ width: "2rem" }}></div> {/* Spacer */}
          </div>
        )}
      </div>
    </>
  );
}
