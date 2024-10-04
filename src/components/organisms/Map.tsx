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
import PopupSection from './PopupSection';

/**
 * Mapbox map component.
 */
export default function Map() {
  const { map, setMap, parentLayer, setParentLayer, setColor } = useContext(MapContext);
    
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
  

  useEffectAfterMount(() => {
    if (map) {
      // Update the map layers of the current page.
      const section: Section = pathToSection(location.pathname);
      mapbox.setLayers(section, map);

      // Update the map parent layer and color of the current page.
      const mapSection = mapSections.find((sec) => sec.id === section)!;
      mapSection.attributeParentLayer && setParentLayer(mapSection.attributeParentLayer);
      setColor(mapSection.color);
    }
  }, [location.pathname, map, setColor, setParentLayer])

  
  useEffectAfterMount(() => {
    if (!map) return;

    // Add event listeners.
    const mouseEnterHandlerWrapper = (event: mapboxgl.MapMouseEvent) => {
      mapbox.mouseEnterHandler(event, map);
    }
    const mouseLeaveHandlerWrapper = (event: mapboxgl.MapMouseEvent) => {
      mapbox.mouseLeaveHandler(event, map);
    }
    const mouseMoveHandlerWrapper = (event: mapboxgl.MapMouseEvent) => {
      mapbox.mouseMoveHandler(event, map);
    }
    map.on("mouseenter", parentLayer, mouseEnterHandlerWrapper);
    map.on("mouseleave", parentLayer, mouseLeaveHandlerWrapper);
    map.on("mousemove", parentLayer, mouseMoveHandlerWrapper);

    // Cleanup event listeners on component unmount.
    return () => {
      map.off("mouseenter", parentLayer, mouseEnterHandlerWrapper);
      map.off("mouseleave", parentLayer, mouseLeaveHandlerWrapper);
      map.off("mousemove", parentLayer, mouseMoveHandlerWrapper);
    }
  }, [parentLayer]);

  return (
    <>
      <div
        id="map"
        className={styles.map}
        style={{ left: SIDEBAR_WIDTH, width: `calc(100% - ${SIDEBAR_WIDTH}px)` }}
      ></div>
      <PopupSection>
        <h1>Popup</h1>
        <p>Contents</p>
      </PopupSection>
    </>

  );
}