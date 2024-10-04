import { useContext, useState } from 'react';
import styles from './PopupSection.module.css';
import { MapContext } from '../../context/MapContext';

type PopupPosition = {
  x: number;
  y: number;
}

type PopupSize = {
  width: number;
  maxWidth: number;
  height: number;
  offset: number;
}

type PopupSectionProps = {
  children: React.ReactNode;
}

/**
 * Popup component for the map.
 */
export default function PopupSection({ children }: PopupSectionProps) {
  const { map } = useContext(MapContext);
  const [position, setPosition] = useState<PopupPosition>({ x: 0, y: 0 });
  const [size, setSize] = useState<PopupSize>({
    width: 200,
    maxWidth: 300,
    height: 180,
    offset: 30,
  });

  // const updatePopupPosition = (event: mapboxgl.MapMouseEvent, popup: HTMLDivElement) => {
  //   if (event.point.x + size.maxWidth + size.offset > mapWidth) {
  //     popup.style.left = `${event.point.x - popupMaxWidth - offset}px`;
  //   } else {
  //     popup.style.left = `${event.point.x + size.offset}px`;
  //   }
  //   if (event.point.y + popupHeight - offset > window.innerHeight * 0.8) {
  //     popup.style.top = `${event.point.y - popupHeight + offset}px`;
  //   } else {
  //     popup.style.top = `${event.point.y - offset}px`;
  //   }
  //   popup.classList.remove("invisible");
  // }

  return (
    <div
      className={styles.container}
      style={{
        width: size.width,
        maxWidth: size.maxWidth,
        height: size.height,
      }}
    >
      {children}
    </div>
  );
}