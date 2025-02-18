import { useContext, useState } from "react";
import { MapQueryContext } from "../context/MapQueryContext";
import useEffectAfterMount from "./useEffectAfterMount";
import * as utils from "../utils/utils";

/**
 * Custom hook to manage neighborhood name from map interaction.
 */
export default function useNameFromMap() {
  const { hoveredProperty, selectedProperty } = useContext(MapQueryContext);
  const [hoveredCountyName, setHoveredCountyName] = useState<string>("");
  const [hoveredNeighborhoodName, setHoveredNeighborhoodName] =
    useState<string>("");
  const [selectedCountyName, setSelectedCountyName] = useState<string>("");
  const [selectedNeighborhoodName, setSelectedNeighborhoodName] =
    useState<string>("");

  useEffectAfterMount(() => {
    if (!hoveredProperty) return;
    const geoid = hoveredProperty.GEOID.toString();
    setHoveredCountyName(utils.getCountyName(geoid));
    setHoveredNeighborhoodName(utils.getNeighborhoodName(geoid));
  }, [hoveredProperty]);

  useEffectAfterMount(() => {
    if (!selectedProperty) return;
    const geoid = selectedProperty.GEOID.toString();
    setSelectedCountyName(utils.getCountyName(geoid));
    setSelectedNeighborhoodName(utils.getNeighborhoodName(geoid));
  }, [selectedProperty]);

  return {
    hoveredCountyName,
    hoveredNeighborhoodName,
    selectedCountyName,
    selectedNeighborhoodName,
  };
}
