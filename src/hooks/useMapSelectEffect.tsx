import {
  RGBA,
  GEOID,
  OUTLINE_LAYER_HOVER,
  THICK_LINE_WEIGHT_HOVER,
  OUTLINE_LAYER_SELECT,
  THICK_LINE_WEIGHT_SELECT,
} from "../constants/mapConstants";
import * as mapbox from "../services/mapbox";
import { isTransparent } from "../utils/utils";
import { useContext, useEffect } from "react";
import useEffectAfterMount from "./useEffectAfterMount";
import { MapQueryContext } from "../context/MapQueryContext";
import { MapContext } from "../context/MapContext";

/**
 * Add selection effect to the map's selected features.
 * @param layer Name of the layer to add select effect.
 * @param map Mapbox map instance to add select effect.
 * @param enableClickEvent Flag to enable click event.
 */
export default function useMapSelectEffect(
  layer: string,
  map?: mapboxgl.Map,
  enableClickEvent?: boolean
) {
  const { mapMode } = useContext(MapContext);
  const { selectedGeoId, setSelectedGeoId } = useContext(MapQueryContext);

  // Subscribe event handlers to the map.
  useEffect(() => {
    if (!map) return;

    // Skip non-selected features(filled with transparent color).
    const isSelectedFeature = (event: mapboxgl.MapMouseEvent): boolean => {
      const feature = map.queryRenderedFeatures(event.point, {
        layers: [layer],
      })[0];
      const fillColor = (feature?.layer?.paint as { "fill-color": RGBA })[
        "fill-color"
      ];
      return !isTransparent(fillColor);
    };

    const mouseLeaveHandler = () => {
      map.getCanvas().style.cursor = "grab";
      mapbox.hideLineWidth(OUTLINE_LAYER_HOVER, map);
    };

    const mouseMoveHandler = (event: mapboxgl.MapMouseEvent) => {
      if (!isSelectedFeature(event)) {
        map.getCanvas().style.cursor = "grab";
        mapbox.hideLineWidth(OUTLINE_LAYER_HOVER, map);
        return;
      }
      map.getCanvas().style.cursor = "pointer";

      const feature = map.queryRenderedFeatures(event.point, {
        layers: [layer],
      })[0];

      mapbox.setLineWidth(
        OUTLINE_LAYER_HOVER,
        GEOID,
        feature.properties![GEOID],
        THICK_LINE_WEIGHT_HOVER,
        map
      );
    };

    const mouseDownHandler = () => {
      map.getCanvas().style.cursor = "grabbing";
    };

    const mouseUpHandler = () => {
      map.getCanvas().style.cursor = "grab";
    };

    const mouseClickHandler = (event: mapboxgl.MapMouseEvent) => {
      if (!isSelectedFeature(event)) return;

      const feature = map.queryRenderedFeatures(event.point, {
        layers: [layer],
      })[0];

      setSelectedGeoId((prev) => feature?.properties![GEOID] ?? prev);
    };

    // Add event listeners.
    map.on("mouseleave", layer, mouseLeaveHandler);
    map.on("mousemove", layer, mouseMoveHandler);
    map.on("mousedown", mouseDownHandler);
    map.on("mouseup", mouseUpHandler);
    enableClickEvent && map.on("click", layer, mouseClickHandler);

    // Cleanup event listeners on component unmount.
    return () => {
      map.off("mouseleave", layer, mouseLeaveHandler);
      map.off("mousemove", layer, mouseMoveHandler);
      map.off("mousedown", mouseDownHandler);
      map.off("mouseup", mouseUpHandler);
      enableClickEvent && map.off("click", layer, mouseClickHandler);
    };
  }, [layer, map, enableClickEvent]);

  // Handle selection effect based on selected GeoId.
  useEffectAfterMount(() => {
    if (!map) return;

    if (selectedGeoId === undefined) {
      mapbox.hideLineWidth(OUTLINE_LAYER_SELECT, map);
      return;
    }

    mapbox.setLineWidth(
      OUTLINE_LAYER_SELECT,
      GEOID,
      selectedGeoId,
      THICK_LINE_WEIGHT_SELECT,
      map
    );
  }, [map, selectedGeoId]);
}
