import styles from './MapViewer.module.css';
import { useContext, useEffect, useRef } from "react";
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
export default function MapViewer() {
  const { map, setMap, setParentLayer, setColor, satelliteMode } = useContext(MapContext);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Create a map instance on component mount.
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const temp = mapbox.createMap(mapContainerRef.current.id);
    temp.on("load", () => {
      setMap(temp);
    });

    // Cleanup function to remove the map instance on component unmount
    return () => {
      map && mapbox.removeMap(map);
      setMap(undefined);
    };
  }, []);

  
  useEffectAfterMount(() => {
    if (!map) return;

      // Update the map layers of the current page.
      const section: Section = pathToSection(location.pathname);
      mapbox.setLayers(section, map);

      // Update the map parent layer and color of the current page.
      const mapSection = mapSections.find((sec) => sec.id === section)!;
      setParentLayer(mapSection.parentLayer);
      setColor(mapSection.color);

      return () => {
        setParentLayer("");
        setColor(undefined);
      }
  }, [location.pathname, map, setColor, setParentLayer]);

  // Resize the map when its display mode changes.
  useEffectAfterMount(() => {
    if (!map) return;
    map.resize();
  }, [satelliteMode, map]);

  /**
   * Adding Google 3D tiles through mapbox custom three.js layer works.
   * However, syncing coordinate system between mapbox and Google 3D tiles
   * is not working. Therefore, this part is disabled. TO be fixed later.
   */
  // useEffectAfterMount(() => {
  //   if (!map) return;

  //   // Add three.js custom layer to the map.
  //   const custom3DLayer = create3DLayer("3d-layer", 1, MODEL_URL);
  //   map.addLayer(custom3DLayer, OUTLINE_LAYER);
    
  //   return () => {
  //     map.removeLayer("3d-layer");
  //   }
  // }, [map]);

  return (
    <div
      id="map"
      ref={mapContainerRef}
      className={styles.map}
      style={{
        left: SIDEBAR_WIDTH,
        width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
        display: satelliteMode ? 'none' : 'block',
      }}
    >
    </div>
  );
}
