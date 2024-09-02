import styles from './Map.module.css';
import { useContext, useEffect } from "react";
import * as mapbox from "../services/mapbox";
import { useLocation } from 'react-router-dom';
import { pathToSection, Section } from '../services/navigate';
import { MapContext } from '../context/MapContext';
import { mapSections } from '../constants/mapConstants';

export default function Map() {
  const { map, setMap, setParentLayer } = useContext(MapContext);
  const location = useLocation();

  // Create a map instance on component mount.
  useEffect(() => {
    const temp = mapbox.CreateMap();
    temp.on("load", () => {
      setMap(temp);
    });

    // Cleanup function to remove the map instance on component unmount
    return () => {
      map && mapbox.RemoveMap(map);
      setMap(undefined);
    };
  }, [])

  
  useEffect(() => {
    if (map) {
      // Update the map layers of the current location.
      const section: Section = pathToSection(location.pathname);
      mapbox.setLayers(section, map);

      // Update the map parent layer of the current location.
      const mapSection = mapSections.find((sec) => sec.id === section);
      mapSection && setParentLayer(mapSection.attributeParentLayer);
    }
  }, [location.pathname, map])

  return (
    <div id="map" className={styles.map}></div>
  )
}

