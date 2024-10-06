import { FillColor, GEOID, OUTLINE_LAYER, THICK_LINE_WEIGHT } from '../constants/mapConstants';
import useEffectAfterMount from './useEffectAfterMount';
import * as mapbox from '../services/mapbox';
import { isWhiteFillColor } from '../utils/utils';

/**
 * Add selection effect to the map's selected features.
 * @param layer Name of the layer to add select effect.
 * @param map Mapbox map instance to add select effect.
 */
export default function useMapSelectEffect(layer: string, map?: mapboxgl.Map) {

  useEffectAfterMount(() => {
    if (!map) return;
    
    const mouseEnterHandler = () => {
      map.getCanvas().style.cursor = "pointer";
    }
    const mouseLeaveHandler = () => {
      map.getCanvas().style.cursor = "grab";
      mapbox.hideLineWidth(OUTLINE_LAYER, map);
    }
    const mouseMoveHandler = (event: mapboxgl.MapMouseEvent) => {
      const feature = map.queryRenderedFeatures(event.point, {layers: [layer]})[0];
      const fillColor = (feature.layer!.paint as { "fill-color": FillColor })["fill-color"];

      // Skip features with white fill color (non-selected features).
      if (!isWhiteFillColor(fillColor)) {
        mapbox.setLineWidth(OUTLINE_LAYER, GEOID, feature.properties![GEOID], THICK_LINE_WEIGHT, map);
      }
    }

    // Add event listeners.
    map.on("mouseenter", layer, mouseEnterHandler);
    map.on("mouseleave", layer, mouseLeaveHandler);
    map.on("mousemove", layer, mouseMoveHandler);

    // Cleanup event listeners on component unmount.
    return () => {
      map.off("mouseenter", layer, mouseEnterHandler);
      map.off("mouseleave", layer, mouseLeaveHandler);
      map.off("mousemove", layer, mouseMoveHandler);
    }
  }, [layer]);
}