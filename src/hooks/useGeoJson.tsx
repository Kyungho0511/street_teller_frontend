import { useEffect, useState } from "react";
import { HealthcareFeatureCollection } from "../constants/geoJsonConstants";

/**
 * Custom hook to fetch geoJson data from the file path.
 * @param filePath File path of the geoJson data
 */
export default function useGeoJson(filePath: string) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>();
  const [geoJson, setGeoJson] = useState<HealthcareFeatureCollection | undefined>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    if (!geoJson)
      {
        const fetchData = async () => {
          try {
            const response = await fetch(filePath);
            if (!response.ok) {
              throw new Error("Failed to fetch GeoJson data: " + response.statusText);
            }
            const data = await response.json();
            setGeoJson(data);
          } 
          catch (error) {
            if (error instanceof Error) {
              setError(error.message);
              console.error("Failed to fetch GeoJson data: " + error.message);
            }
          } 
          finally {
            setLoading(false);
          }
        };
        fetchData();
    }
  }, []);

  return [loading, error, geoJson, setGeoJson] as const;
}