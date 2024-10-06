import styles from './Map.module.css';
import { useContext, useEffect } from "react";
import * as mapbox from "../../services/mapbox";
import { useLocation } from 'react-router-dom';
import { pathToSection } from '../../utils/utils';
import { MapContext } from '../../context/MapContext';
import { mapSections } from '../../constants/mapConstants';
import { Section } from '../../constants/surveyConstants';
import useEffectAfterMount from '../../hooks/useEffectAfterMount';
import { SIDEBAR_WIDTH } from './Sidebar';

/**
 * Mapbox map component.
 */
export default function Map() {
  const { map, setMap, setParentLayer, setColor } = useContext(MapContext);
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
  }, []);

  useEffectAfterMount(() => {
    if (map) {
      // Update the map layers of the current page.
      const section: Section = pathToSection(location.pathname);
      mapbox.setLayers(section, map);

      // Update the map parent layer and color of the current page.
      const mapSection = mapSections.find((sec) => sec.id === section)!;
      setParentLayer(mapSection.parentLayer);
      setColor(mapSection.color);
    }
  }, [location.pathname, map, setColor, setParentLayer]);

  return (
    <div
      id="map"
      className={styles.map}
      style={{ left: SIDEBAR_WIDTH, width: `calc(100% - ${SIDEBAR_WIDTH}px)` }}
    ></div>
  );
}