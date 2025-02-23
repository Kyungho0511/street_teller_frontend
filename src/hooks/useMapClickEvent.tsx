import { useContext, useEffect } from "react";
import { MapContext } from "../context/MapContext";

/**
 * Custom hook to handle map click events.
 * @param key The key to get index value from the feature properties.
 * @param setSelectedIndex The function to set the selected index.
 */
export default function useMapClickEvent(
  key: string,
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | undefined>>
) {
  const { mapViewer, parentLayer } = useContext(MapContext);

  useEffect(() => {
    if (!mapViewer) return;

    const clickHandler = (event: mapboxgl.MapMouseEvent) => {
      const feature = mapViewer.queryRenderedFeatures(event.point, {
        layers: [parentLayer],
      })[0];

      setSelectedIndex((prev) => feature?.properties![key] ?? prev);
    };
    mapViewer.on("click", clickHandler);

    return () => {
      mapViewer.off("click", clickHandler);
    };
  }, [mapViewer, parentLayer, key]);
}
