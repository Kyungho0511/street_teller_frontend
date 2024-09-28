import { useEffect, useState } from "react";
import { HealthcareFeatureCollection } from "../constants/geoJsonConstants";

export default function useGeoJson({ filePath }: { filePath: string }) {
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
              throw new Error("Network error: " + response.statusText);
            }
            const data = await response.json();
            setGeoJson(data);
          } 
          catch (error) {
            if (error instanceof Error) {
              setError(error.message);
              console.error(error.message);
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