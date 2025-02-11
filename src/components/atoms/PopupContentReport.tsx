import styles from "./PopupContent.module.css";
import { useContext, useEffect } from "react";
import { MapContext } from "../../context/MapContext";
import { PopupContext } from "../../context/PopupContext";
import { NUMBER_OF_CLUSTERING_STEPS } from "../../constants/surveyConstants";
import Colorbox from "./Colorbox";
import ReportPage from "../../pages/ReportPage";
import useNameFromMap from "../../hooks/useNeighborhoodName";
import useClusterFromMap from "../../hooks/useClusterLabel";

/**
 * Popup content component for the {@link ReportPage}
 */
export default function PopupContentReport() {
  const { mapViewer, parentLayer } = useContext(MapContext);
  const { setSelectedReport } = useContext(PopupContext);
  const [clusters] = useClusterFromMap(NUMBER_OF_CLUSTERING_STEPS.toString());
  const [countyName, neighborhoodName] = useNameFromMap();

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
