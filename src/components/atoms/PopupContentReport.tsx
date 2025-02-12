import styles from "./PopupContent.module.css";
import { useContext } from "react";
import { PopupContext } from "../../context/PopupContext";
import { NUMBER_OF_CLUSTERING_STEPS } from "../../constants/surveyConstants";
import Colorbox from "./Colorbox";
import ReportPage from "../../pages/ReportPage";
import useNameFromMap from "../../hooks/useNameFromMap";
import useClusterFromMap from "../../hooks/useClusterFromMap";
import useMapClickEvent from "../../hooks/useMapClickEvent";

/**
 * Popup content component for the {@link ReportPage}
 */
export default function PopupContentReport() {
  const { setSelectedReport } = useContext(PopupContext);
  const [clusters] = useClusterFromMap(NUMBER_OF_CLUSTERING_STEPS.toString());
  const [countyName, neighborhoodName] = useNameFromMap();

  // Set selected report based on the map mouse event.
  useMapClickEvent("report", setSelectedReport);

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
