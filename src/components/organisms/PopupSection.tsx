import { useContext, useEffect, useState } from 'react';
import styles from './PopupSection.module.css';
import { ViewerContext } from '../../context/ViewerContext';
import { SIDEBAR_WIDTH } from './Sidebar';
import { FOOTBAR_HEIGHT } from './Footbar';
import { FillColor, POPUP } from '../../constants/mapConstants';
import { isWhiteFillColor } from '../../utils/utils';
import useMapSelectEffect from '../../hooks/useMapSelectEffect';
import { PopupContext } from '../../context/PopupContext';
import { HealthcareProperties } from '../../constants/geoJsonConstants';

type Coordinate = {
  x: number;
  y: number;
}
type PopupSectionProps = {  
  enableSelectEffect?: boolean;
  children: React.ReactNode;
}

/**
 * Container component for the map popup.
 */
export default function PopupSection({ enableSelectEffect, children }: PopupSectionProps) {
  const { map, parentLayer } = useContext(ViewerContext);
  const { setProperties } = useContext(PopupContext);

  const [position, setPosition] = useState<Coordinate>({ x: 0, y: 0 });
  const [display, setDisplay] = useState<"block" | "none">("none");

  // Add selection effect to the map's selected features.
  useMapSelectEffect(parentLayer, map, enableSelectEffect);

  // Set properties based on the map mouse event.
  useEffect(() => {
    if (!map) return;
    const updateProperties = (event: mapboxgl.MapMouseEvent) => {
      const feature = map.queryRenderedFeatures(event.point, {layers: [parentLayer]})[0];
      setProperties(feature.properties as HealthcareProperties);
    }
    map.on("mousemove", parentLayer, updateProperties);

    // Cleanup event listeners on component unmount.
    return () => {
      map.off("mousemove", parentLayer, updateProperties);
    }
  }, [map, parentLayer, setProperties]);

  // Set popup status based on the map mouse event.
  useEffect(() => {
    if (!map) return;

    const showPopup = () => {
      setDisplay("block");
    }

    const hidePopup = () => {
      setDisplay("none");
    }

    const updatePopupPosition = (event: mapboxgl.MapMouseEvent) => {
      const mapWidth = window.innerWidth;
      const translate = {x: 0, y: 0};
  
      // Skip features with white fill color (non-selected features).
      const feature = map!.queryRenderedFeatures(event.point, {layers: [parentLayer]})[0];
      const fillColor = (feature.layer!.paint as { "fill-color": FillColor })["fill-color"];
      if (isWhiteFillColor(fillColor)) {
        hidePopup();
        return;
      } 
      showPopup();
      // Set X position of the popup.
      if (event.point.x + POPUP.width + POPUP.offset > mapWidth) {
        translate.x = event.point.x - POPUP.width - POPUP.offset;
      } else {
        translate.x = event.point.x + POPUP.offset;
      }
      // Set Y position of the popup.
      if (event.point.y + POPUP.height - POPUP.offset > window.innerHeight - FOOTBAR_HEIGHT) {
        translate.y = event.point.y - POPUP.height + POPUP.offset;
      } else {
        translate.y = event.point.y - POPUP.offset;
      } 
      setPosition({ x: translate.x, y: translate.y });
    }

    map.on("mousemove", parentLayer, updatePopupPosition);
    map.on("mouseleave", parentLayer, hidePopup);

    // Cleanup event listeners on component unmount.
    return () => {
      map.off("mousemove", parentLayer, updatePopupPosition);
      map.off("mouseleave", parentLayer, hidePopup);
    }
  }, [map, parentLayer]);

  return (
    <div
      className={styles.container}
      style={{
        display: display,
        width: POPUP.width,
        height: POPUP.height,
        left: position.x,
        top: position.y,
      }}
    >
      {children}
    </div>
  );
}