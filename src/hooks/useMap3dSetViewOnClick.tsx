import { useContext, useEffect } from "react";
import Map3dViewer from "../components/organisms/Map3dViewer";
import { MapContext } from "../context/MapContext";
import * as utils from "../utils/utils";
import { MapQueryContext } from "../context/MapQueryContext";

/**
 * Custom hook to set the view to the selected feature for {@link Map3dViewer}.
 */
export default function useMap3dSetViewOnClick() {
  const { mapViewer, parentLayer } = useContext(MapContext);
  const { setSelectedFeaturePosition } = useContext(MapQueryContext);

  // Set the center longitude and latitude of the selected polygon.
  useEffect(() => {
    if (!mapViewer) return;

    const handleClick = (event: mapboxgl.MapMouseEvent) => {
      const feature = mapViewer.queryRenderedFeatures(event.point, {
        layers: [parentLayer],
      })[0];
      if (!feature || !(feature.geometry.type === "Polygon")) return;

      const coordinates = feature.geometry.coordinates[0];
      const center = utils.getCenterCoordinate(coordinates);
      setSelectedFeaturePosition(center);
    };

    mapViewer.on("click", handleClick);

    return () => {
      mapViewer.off("click", handleClick);
    };
  }, [mapViewer, parentLayer, setSelectedFeaturePosition]);
}
