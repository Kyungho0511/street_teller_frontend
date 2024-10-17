import { FillColor, GEOID, OUTLINE_LAYER, THICK_LINE_WEIGHT } from '../constants/mapConstants';
import * as mapbox from '../services/mapbox';
import { isWhiteFillColor } from '../utils/utils';
import { useEffect } from 'react';

/**
 * Add selection effect to the map's selected features.
 * @param layer Name of the layer to add select effect.
 * @param map Mapbox map instance to add select effect.
 */
export default function useMapSelectEffect(
  layer: string,
  map?: mapboxgl.Map,
  enableSelectEffect?: boolean,
) {

  useEffect(() => {
    if (!map || !enableSelectEffect) return;

    // Skip non-selected features(filled with white color).
    const isSelectedFeature = (event: mapboxgl.MapMouseEvent): boolean => {
      const feature = map.queryRenderedFeatures(event.point, {
        layers: [layer],
      })[0];
      const fillColor = (feature?.layer?.paint as { "fill-color": FillColor })[
        "fill-color"
      ];
      return !isWhiteFillColor(fillColor);
    };

    const mouseLeaveHandler = () => {
      map.getCanvas().style.cursor = "grab";
      mapbox.hideLineWidth(OUTLINE_LAYER, map);
    };

    const mouseMoveHandler = (event: mapboxgl.MapMouseEvent) => {
      if (!isSelectedFeature(event)) {
        map.getCanvas().style.cursor = "grab";
        mapbox.hideLineWidth(OUTLINE_LAYER, map);
        return;
      }
      map.getCanvas().style.cursor = "pointer";
      const feature = map.queryRenderedFeatures(event.point, {
        layers: [layer],
      })[0];

      mapbox.setLineWidth(
        OUTLINE_LAYER,
        GEOID,
        feature.properties![GEOID],
        THICK_LINE_WEIGHT,
        map
      );
    };

    const mouseDownHandler = () => {
      map.getCanvas().style.cursor = "grabbing";
    };

    const mouseUpHandler = () => {
      map.getCanvas().style.cursor = "grab";
    };

    // Add event listeners.
    map.on("mouseleave", layer, mouseLeaveHandler);
    map.on("mousemove", layer, mouseMoveHandler);
    map.on("mousedown", mouseDownHandler);
    map.on("mouseup", mouseUpHandler);

    // Cleanup event listeners on component unmount.
    return () => {
      map.off("mouseleave", layer, mouseLeaveHandler);
      map.off("mousemove", layer, mouseMoveHandler);
      map.off("mousedown", mouseDownHandler);
      map.off("mouseup", mouseUpHandler);
    };
  }, [layer, map, enableSelectEffect]);
}
