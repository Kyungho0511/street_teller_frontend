import { useEffect, useState } from "react";
import useEffectAfterMount from "./useEffectAfterMount";
import * as mapbox from "../services/mapbox";
import { TractFeatureCollection } from "../constants/geoJsonConstants";

/**
 * Custom hook to fetch geoJson data from the file path.
 * @param filePath File path of the geoJson data
 * @param mapViewer Map instance to add the geoJson data
 * @param sourceName Name of the source to use the geoJson data
 */
export default function useGeoJson(
  filePath: string,
  mapViewer: mapboxgl.Map | undefined,
  sourceName: string
) {
  const [loadingGeoJson, setLoadingGeoJson] = useState<boolean>(false);
  const [errorGeoJson, setErrorGeoJson] = useState<string | undefined>();
  const [geoJson, setGeoJson] = useState<TractFeatureCollection | undefined>();

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

  useEffectAfterMount(() => {
    if (!mapViewer || !geoJson) return;

    // Add selected properties to geoJson data.
    geoJson.features.forEach((feature) => {
      feature.properties.selected = true;
    });

    // Add geoJson data to the map.
    mapbox.addSource(geoJson, sourceName, mapViewer);
  }, [mapViewer, geoJson]);

  return { loadingGeoJson, errorGeoJson };
}
