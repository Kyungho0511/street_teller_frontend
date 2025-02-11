import styles from "./PopupContent.module.css";
import { useContext, useEffect, useState } from "react";
import { PopupContext } from "../../context/PopupContext";
import ClusterPage from "../../pages/ClusterPage";
import * as utils from "../../utils/utils";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import { Survey, SurveyContext } from "../../context/SurveyContext";
import { HealthcarePropertyName } from "../../constants/geoJsonConstants";
import { Cluster } from "../../constants/surveyConstants";
import Colorbox from "./Colorbox";
import { MapContext } from "../../context/MapContext";
import useNeighborhoodName from "../../hooks/useNeighborhoodName";

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
  const { survey } = useContext(SurveyContext);
  const { property, setSelectedCluster } = useContext(PopupContext);
  const [clusters, setClusters] = useState<Cluster[]>();
  const [countyName, neighborhoodName] = useNeighborhoodName();

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

  useEffectAfterMount(() => {
    if (!property) return;

    // Set cluster labels based on the property's cluster ID.
    const clusters: Cluster[] = [];
    for (let i = 1, n = parseInt(clusterId) + 1; i < n; i++) {
      const clusterKey = `cluster${i}`;
      const clusterList = survey[clusterKey as keyof Survey];
      const cluster =
        clusterList.list[
          property[clusterKey as HealthcarePropertyName] as number
        ];
      clusters.push(cluster as Cluster);
    }
    setClusters(clusters);
  }, [property]);

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
