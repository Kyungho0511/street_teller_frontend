import styles from "./PopupContent.module.css";
import { useContext, useEffect, useState } from "react";
import { MapContext } from "../../context/MapContext";
import { PopupContext } from "../../context/PopupContext";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import * as utils from "../../utils/utils";
import {
  Cluster,
  NUMBER_OF_CLUSTERING_STEPS,
} from "../../constants/surveyConstants";
import { Survey, SurveyContext } from "../../context/SurveyContext";
import { HealthcarePropertyName } from "../../constants/geoJsonConstants";
import Colorbox from "./Colorbox";
import ReportPage from "../../pages/ReportPage";

/**
 * Popup content component for the {@link ReportPage}
 */
export default function PopupContentReport() {
  const { mapViewer, parentLayer } = useContext(MapContext);
  const { survey } = useContext(SurveyContext);
  const { property, setSelectedReport } = useContext(PopupContext);
  const [countyName, setCountyName] = useState<string>("");
  const [neighborhoodName, setNeighborhoodName] = useState<string>("");
  const [clusters, setClusters] = useState<Cluster[]>();

  // Set selected report based on the map mouse event.
  useEffect(() => {
    if (!mapViewer) return;

    const updateSelectedReport = (event: mapboxgl.MapMouseEvent) => {
      const feature = mapViewer.queryRenderedFeatures(event.point, {
        layers: [parentLayer],
      })[0];
      setSelectedReport(feature.properties!["report"]);
    };
    mapViewer.on("click", parentLayer, updateSelectedReport);

    return () => {
      mapViewer.off("click", updateSelectedReport);
    };
  }, [mapViewer, parentLayer]);

  useEffectAfterMount(() => {
    if (!property) return;

    // Set location names based on the property's GEOID.
    const geoid = property.GEOID.toString();
    setCountyName(utils.getCountyName(geoid));
    setNeighborhoodName(utils.getNeighborhoodName(geoid));

    // Set cluster labels based on the property's cluster ID.
    const clusters: Cluster[] = [];
    for (let i = 1, n = NUMBER_OF_CLUSTERING_STEPS + 1; i < n; i++) {
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
