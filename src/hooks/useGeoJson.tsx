import { useContext, useEffect, useState } from "react";
import { MapContext } from "../context/MapContext";
import { TractFeatureCollection } from "../constants/geoJsonConstants";

/**
 * Custom hook to fetch geoJson data from the file path.
 * @param filePath File path of the geoJson data
 */
export default function useGeoJson(filePath: string) {
  const [loadingGeoJson, setLoadingGeoJson] = useState<boolean>(false);
  const [errorGeoJson, setErrorGeoJson] = useState<string | undefined>();
  const { geoJson, setGeoJson } = useContext(MapContext);

  // Fetch geoJson data from the file path.
  useEffect(() => {
    setLoadingGeoJson(true);
    setErrorGeoJson(undefined);
    if (!geoJson) {
      const fetchData = async () => {
        try {
          const response = await fetch(filePath);
          const data: TractFeatureCollection = await response.json();

          // Add selected properties to geoJson data.
          data.features.forEach((feature) => {
            feature.properties.selected = true;
          });

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

  return { loadingGeoJson, errorGeoJson };
}
