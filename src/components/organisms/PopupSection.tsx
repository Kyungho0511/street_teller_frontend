import { useContext, useEffect, useRef, useState } from 'react';
import styles from './PopupSection.module.css';
import { MapContext } from '../../context/MapContext';
import { SIDEBAR_WIDTH } from './Sidebar';
import { FOOTBAR_HEIGHT } from './Footbar';
import { POPUP } from '../../constants/mapConstants';

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

  // Set popup status based on the map mouse event.
  useEffect(() => {
    if (!map) return;

    const updatePopupPosition = (event: mapboxgl.MapMouseEvent) => {
      const mapWidth = window.innerWidth - SIDEBAR_WIDTH;
      const mapOrigin = { x: SIDEBAR_WIDTH, y: 0 };
      const translate = {x: 0, y: 0};

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

    const showPopup = () => {
      setDisplay("block");
    }

    const hidePopup = () => {
      setDisplay("none");
    }

    map.on("mousemove", parentLayer, updatePopupPosition);
    map.on("mouseenter", parentLayer, showPopup);
    map.on("mouseleave", parentLayer, hidePopup);

    // Cleanup event listeners on component unmount.
    return () => {
      map.off("mousemove", parentLayer, updatePopupPosition);
      map.off("mouseenter", parentLayer, showPopup);
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