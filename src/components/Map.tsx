import styles from './Map.module.css';
import { useEffect, useState } from "react";
import { CreateMap, setLayers, RemoveMap } from "../services/mapbox";
import { useLocation } from 'react-router-dom';
import { pathToSection, Section } from '../services/navigate';

export default function Map() {
  const [map, setMap] = useState<mapboxgl.Map>();
  const location = useLocation();

  // Create a map instance on component mount.
  useEffect(() => {
    const temp = CreateMap();
    temp.on("load", () => {
      setMap(temp);
    });

    // Cleanup function to remove the map instance on component unmount
    return () => {
      map && RemoveMap(map);
      setMap(undefined);
    };
  }, [])

  // Update the map layers based on the current location.
  useEffect(() => {
    if (map) {
      const section: Section = pathToSection(location.pathname);
      setLayers(section, map);
    }
  }, [location.pathname, map])

  return (
    <div id="map" className={styles.map}></div>
  )
}

