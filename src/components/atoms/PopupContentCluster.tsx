import styles from "./PopupContent.module.css";
import { useContext, useState } from "react";
import { PopupContext } from "../../context/PopupContext";
import ClusterPage from "../../pages/ClusterPage";
import * as utils from "../../utils/utils";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import { SurveyContext } from "../../context/SurveyContext";
import { HealthcarePropertyName } from "../../constants/geoJsonConstants";
import { ClusterCheckboxItem } from "../../constants/surveyConstants";
import Colorbox from "./Colorbox";

type PopupContentClusterProps = {
  clusterId: string;
};

/**
 * Popup text component for the {@link ClusterPage}
 */
export default function PopupContentCluster({
  clusterId,
}: PopupContentClusterProps) {
  const { survey } = useContext(SurveyContext);
  const { property } = useContext(PopupContext);
  const [countyName, setCountyName] = useState<string>("");
  const [neighborhoodName, setNeighborhoodName] = useState<string>("");
  const [cluster, setCluster] = useState<ClusterCheckboxItem>();

  useEffectAfterMount(() => {
    if (!property) return;

    // Set location names based on the property's GEOID.
    const geoid = property.GEOID.toString();
    setCountyName(utils.getCountyName(geoid));
    setNeighborhoodName(utils.getNeighborhoodName(geoid));

    // Set cluster label based on the property's cluster ID.
    const clusterKey = `cluster${clusterId}` as HealthcarePropertyName;
    const clusterList = survey.clusterLists.find(
      (clusterList) => clusterList.name === clusterKey
    )!;
    const cluster = clusterList.list[property[clusterKey]];
    setCluster(cluster);
  }, [property]);

  return (
    <>
      <p className={styles.title}>{`${neighborhoodName}, ${countyName}`}</p>
      {cluster && (
        <div className={styles.body}>
          <div>
            <Colorbox label={cluster.name} color={cluster.color} />
          </div>
          {/* <span className={styles.value}>123123</span> */}
        </div>
      )}
    </>
  );
}
