import { useContext, useEffect, useRef, useState } from "react";
import styles from "./LocationSearchBar.module.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import mapboxgl from "mapbox-gl";
import { MapContext } from "../../context/MapContext";

/**
 * Location search bar component for a map component.
 */
export default function LocationSearchBar() {
  const { mapViewer } = useContext(MapContext);
  const [searchElement, setSearchElement] = useState<HTMLElement>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Add location search bar to the map.
  useEffect(() => {
    if (!mapViewer) return;

    const geocoder = new MapboxGeocoder({
      accessToken: import.meta.env.VITE_API_KEY_MAPBOX as string,
      mapboxgl: mapboxgl,
      marker: true,
      placeholder: "Search location",
    });
    setSearchElement(geocoder.onAdd(mapViewer));
  }, [mapViewer]);

  // Relocate the search bar from default location to the container.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !searchElement) return;
    container.appendChild(searchElement);

    return () => {
      container.removeChild(searchElement);
    };
  }, [searchElement]);

  return <div ref={containerRef} className={styles.container}></div>;
}
