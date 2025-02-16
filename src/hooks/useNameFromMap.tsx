import { useContext, useState } from "react";
import { MapQueryContext } from "../context/MapQueryContext";
import useEffectAfterMount from "./useEffectAfterMount";
import * as utils from "../utils/utils";

/**
 * Custom hook to manage neighborhood name from map interaction.
 */
export default function useNameFromMap() {
  const { property } = useContext(MapQueryContext);
  const [countyName, setCountyName] = useState<string>("");
  const [neighborhoodName, setNeighborhoodName] = useState<string>("");

  useEffectAfterMount(() => {
    if (!property) return;
    const geoid = property.GEOID.toString();
    setCountyName(utils.getCountyName(geoid));
    setNeighborhoodName(utils.getNeighborhoodName(geoid));
  }, [property]);

  return [countyName, neighborhoodName] as const;
}
