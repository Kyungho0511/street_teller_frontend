import styles from "./PopupContent.module.css";
import { useContext } from "react";
import { MapQueryContext } from "../../context/MapQueryContext";
import { NUMBER_OF_CLUSTERING_STEPS } from "../../constants/surveyConstants";
import Colorbox from "./Colorbox";
import ReportPage from "../../pages/ReportPage";
import useNameFromMap from "../../hooks/useNameFromMap";
import useFeatureFromMap from "../../hooks/useFeatureFromMap";
import useMapClickEvent from "../../hooks/useMapClickEvent";

/**
 * Popup content component for the {@link ReportPage}
 */
export default function PopupContentReport() {
  const { setSelectedReport } = useContext(MapQueryContext);
  const { hoveredFeatures } = useFeatureFromMap(
    NUMBER_OF_CLUSTERING_STEPS.toString()
  );
  const { hoveredCountyName, hoveredNeighborhoodName } = useNameFromMap();

  // Set selected report based on the map mouse event.
  useMapClickEvent("report", setSelectedReport);

  return (
    <>
      <p
        className={styles.title}
      >{`${hoveredNeighborhoodName}, ${hoveredCountyName}`}</p>
      <div className={styles.body}>
        {hoveredFeatures?.length &&
          hoveredFeatures.map((cluster) => (
            <div className={styles.item} key={cluster.id}>
              <Colorbox label={cluster.name} color={cluster.color} />
              <div style={{ width: "2rem" }}></div> {/* Spacer */}
            </div>
          ))}
      </div>
    </>
  );
}
