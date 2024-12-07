import styles from "./PopupContent.module.css";
import { v4 as uuidv4 } from "uuid";
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
  const [clusters, setClusters] = useState<ClusterCheckboxItem[]>();

  useEffectAfterMount(() => {
    if (!property) return;

    // Set location names based on the property's GEOID.
    const geoid = property.GEOID.toString();
    setCountyName(utils.getCountyName(geoid));
    setNeighborhoodName(utils.getNeighborhoodName(geoid));

    // Set cluster labels based on the property's cluster ID.
    const clusters: ClusterCheckboxItem[] = [];
    for (let i = 1, n = parseInt(clusterId) + 1; i < n; i++) {
      const clusterKey = `cluster${i}` as HealthcarePropertyName;
      const clusterList = survey.clusterLists.find(
        (clusterList) => clusterList.name === clusterKey
      )!;
      const cluster = clusterList.list[property[clusterKey]];
      clusters.push(cluster);
    }
    setClusters(clusters);
  }, [property]);

  return (
    <>
      <p className={styles.title}>{`${neighborhoodName}, ${countyName}`}</p>
      <div className={styles.body}>
        {clusters?.length &&
          clusters.map((cluster) => (
            <div className={styles.item} key={uuidv4()}>
              <Colorbox label={cluster.name} color={cluster.color} />
            </div>
          ))}
      </div>
    </>
  );
}
