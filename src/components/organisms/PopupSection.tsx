import { useContext, useEffect, useRef, useState } from 'react';
import styles from './PopupSection.module.css';
import { MapContext } from '../../context/MapContext';
import { SIDEBAR_WIDTH } from './Sidebar';
import { FOOTBAR_HEIGHT } from './Footbar';
import { FillColor, POPUP } from '../../constants/mapConstants';
import { isWhiteFillColor } from '../../utils/utils';

type Coordinate = {
  x: number;
  y: number;
}

type PopupSectionProps = {
  children: React.ReactNode;
}

/**
 * Popup component for the map.
 */
export default function PopupSection({ children }: PopupSectionProps) {
  const { map, parentLayer } = useContext(MapContext);
  const [position, setPosition] = useState<Coordinate>({ x: 0, y: 0 });
  const [display, setDisplay] = useState<"block" | "none">("none");

  const showPopup = () => {
    setDisplay("block");
  }

  const hidePopup = () => {
    setDisplay("none");
  }

  const updatePopupPosition = (event: mapboxgl.MapMouseEvent) => {
    const mapWidth = window.innerWidth - SIDEBAR_WIDTH;
    const mapOrigin = { x: SIDEBAR_WIDTH, y: 0 };
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
    setPosition({ x: translate.x + mapOrigin.x, y: translate.y + mapOrigin.y });
  }

  // Set popup status based on the map mouse event.
  useEffect(() => {
    if (!map) return;
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