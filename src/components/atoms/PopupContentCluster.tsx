import styles from "./PopupContent.module.css";
import { useContext, useEffect } from "react";
import { PopupContext } from "../../context/PopupContext";
import ClusterPage from "../../pages/ClusterPage";
import Colorbox from "./Colorbox";
import { MapContext } from "../../context/MapContext";
import useNameFromMap from "../../hooks/useNeighborhoodName";
import useClusterFromMap from "../../hooks/useClusterLabel";

type PopupContentClusterProps = {
  clusterId: string;
};

/**
 * Popup content component for the {@link ClusterPage}
 */
export default function PopupContentCluster({
  clusterId,
}: PopupContentClusterProps) {
  const { mapViewer, parentLayer } = useContext(MapContext);
  const { setSelectedCluster } = useContext(PopupContext);
  const [clusters] = useClusterFromMap(clusterId);
  const [countyName, neighborhoodName] = useNameFromMap();

  // Set selected cluster based on the map mouse event.
  useEffect(() => {
    if (!mapViewer) return;

    const updateSelectedCluster = (event: mapboxgl.MapMouseEvent) => {
      const feature = mapViewer.queryRenderedFeatures(event.point, {
        layers: [parentLayer],
      })[0];
      setSelectedCluster(feature.properties!["cluster" + clusterId]);
    };
    mapViewer.on("click", parentLayer, updateSelectedCluster);

    return () => {
      mapViewer.off("click", updateSelectedCluster);
    };
  }, [mapViewer, parentLayer, clusterId]);

  return (
    <>
      <p className={styles.title}>{`${neighborhoodName}, ${countyName}`}</p>
      <div className={styles.body}>
        {clusters?.length &&
          clusters.map((cluster) => (
            <div className={styles.item} key={cluster.id}>
              <Colorbox label={cluster.name} color={cluster.color} />
              <div style={{ width: "2rem" }}></div> {/* Spacer */}
            </div>
          ))}
      </div>
    </>
  );
}
