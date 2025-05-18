import { useEffect, useState } from "react";
import { HealthcareFeatureCollection } from "../constants/geoJsonConstants";
import useEffectAfterMount from "./useEffectAfterMount";
import * as mapbox from "../services/mapbox";
import { pathToSection } from "../utils/utils";

/**
 * Custom hook to fetch geoJson data from the file path.
 * @param filePath File path of the geoJson data
 * @param mapViewer Map instance to add the geoJson data
 * @param layerName Name of the layer to add the geoJson data
 */
export default function useGeoJson(
  filePath: string,
  mapViewer: mapboxgl.Map | undefined,
  layerName: string
) {
  const [loadingGeoJson, setLoadingGeoJson] = useState<boolean>(false);
  const [errorGeoJson, setErrorGeoJson] = useState<string | undefined>();
  const [geoJson, setGeoJson] = useState<
    HealthcareFeatureCollection | undefined
  >();

  // Fetch geoJson data from the file path.
  useEffect(() => {
    setLoadingGeoJson(true);
    setErrorGeoJson(undefined);
    if (!geoJson) {
      const fetchData = async () => {
        try {
          const response = await fetch(filePath);
          const data = await response.json();
          setGeoJson(data);
        } catch {
          const errorMessage = "Failed to fetch GeoJson data";
          setErrorGeoJson(errorMessage);
          console.error(errorMessage);
        } finally {
          setLoadingGeoJson(false);
        }
      };
      fetchData();
    }
  }, []);

  // Add geoJson data to the map.
  useEffectAfterMount(() => {
    if (!mapViewer || !geoJson) return;

    mapbox.addLayer(geoJson, layerName, mapViewer);
    const section = pathToSection(location.pathname);
    mapbox.setLayerSettings(section, mapViewer);
  }, [mapViewer, geoJson]);

  return { loadingGeoJson, errorGeoJson, geoJson, setGeoJson };
}
