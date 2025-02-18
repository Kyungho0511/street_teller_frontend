import styles from "./PopupContent.module.css";
import { useContext } from "react";
import { MapQueryContext } from "../../context/MapQueryContext";
import ClusterPage from "../../pages/ClusterPage";
import Colorbox from "./Colorbox";
import useNameFromMap from "../../hooks/useNameFromMap";
import useClusterFromMap from "../../hooks/useClusterFromMap";
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
  const { hoveredClusters } = useClusterFromMap(clusterId);
  const { hoveredCountyName, hoveredNeighborhoodName } = useNameFromMap();

  // Set selected cluster based on the map mouse event.
  useMapClickEvent(`cluster${clusterId}`, setSelectedCluster);

  return (
    <>
      <p
        className={styles.title}
      >{`${hoveredNeighborhoodName}, ${hoveredCountyName}`}</p>
      <div className={styles.body}>
        {hoveredClusters?.length &&
          hoveredClusters.map((cluster) => (
            <div className={styles.item} key={cluster.id}>
              <Colorbox label={cluster.name} color={cluster.color} />
              <div style={{ width: "2rem" }}></div> {/* Spacer */}
            </div>
          ))}
      </div>
    </>
  );
}
