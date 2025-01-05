import styles from "./LocationSearchBar.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import * as mapboxgl from "mapbox-gl";
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
      collapsed: true,
      bbox: [-74.25909, 40.477399, -73.700272, 40.917577], // NYC 5 boroughs bounding box
    });
    setSearchElement(geocoder.onAdd(mapViewer));
  }, [mapViewer]);

  useEffect(() => {
    // Relocate the search bar from default location to the container.
    const container = containerRef.current;
    if (!container || !searchElement) return;
    container.appendChild(searchElement);

    // Custom style for the search bar.
    const input = searchElement.querySelector("input");
    input?.classList.add(styles.input);

    return () => {
      container.removeChild(searchElement);
    };
  }, [searchElement]);

  return <div ref={containerRef} className={styles.container}></div>;
}
