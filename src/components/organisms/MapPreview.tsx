import styles from "./MapPreview.module.css";
import { useContext, useEffect, useRef } from "react";
import * as mapbox from "../../services/mapbox";
import { MapContext } from "../../context/MapContext";
import { mapConfigs, ZOOM_MODIFIER } from "../../constants/mapConstants";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";

/**
 * Mapbox map viewer component.
 */
export default function MapPreview() {
  const { mapPreview, setMapPreview, previewMode, location } =
    useContext(MapContext);
  const mapPreviewContainerRef = useRef<HTMLDivElement>(null);

  // Create a map instance on component mount.
  useEffect(() => {
    if (!mapPreviewContainerRef.current) return;
    const temp = mapbox.createMap(
      mapPreviewContainerRef.current.id,
      previewMode,
      true
    );
    temp.on("load", () => {
      setMapPreview(temp);
    });

    return () => {
      mapPreview && mapbox.removeMap(mapPreview);
      setMapPreview(undefined);
    };
  }, []);

  // Toggle map preview between satellite and map.
  useEffectAfterMount(() => {
    if (!mapPreview) return;

    const styleUrl =
      previewMode === "satellite"
        ? mapConfigs.style.satelliteSimple
        : mapConfigs.style.mapSimple;
    mapPreview.setStyle(styleUrl);
  }, [previewMode]);

  // Update the preview location on main map location change.
  useEffectAfterMount(() => {
    if (!mapPreview) return;
    mapPreview.setCenter(location.center);
    mapPreview.setZoom(location.zoom - ZOOM_MODIFIER);
  }, [location]);

  return (
    <>
      <div
        id="map-preview"
        ref={mapPreviewContainerRef}
        className={styles.map}
      ></div>
    </>
  );
}
