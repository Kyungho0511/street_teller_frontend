import styles from "./MapViewer.module.css";
import { useContext, useEffect, useRef } from "react";
import * as mapbox from "../../services/mapbox";
import { useLocation } from "react-router-dom";
import { pathToSection } from "../../utils/utils";
import { MapContext } from "../../context/MapContext";
import { mapConfigs, mapSections } from "../../constants/mapConstants";
import { Section } from "../../constants/surveyConstants";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";

/**
 * Mapbox map viewer component.
 */
export default function MapViewer() {
  const {
    mapViewer,
    setMapViewer,
    mapPreview,
    setParentLayer,
    setColor,
    mapMode,
    setLocation,
  } = useContext(MapContext);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    // Create a map instance on component mount.
    if (!mapContainerRef.current) return;
    const temp = mapbox.createMap(mapContainerRef.current.id, mapMode, false);

    // Add event listener to update location state.
    temp.on("moveend", () => {
      const center = temp.getCenter();
      const zoom = temp.getZoom();
      setLocation((prev) => ({ ...prev, center, zoom }));
    });

    temp.on("load", () => {
      setMapViewer(temp);
    });

    return () => {
      mapViewer && mapbox.removeMap(mapViewer);
      setMapViewer(undefined);
    };
  }, []);

  useEffectAfterMount(() => {
    if (!mapViewer) return;

    // Update the map layers of the current page.
    const section: Section = pathToSection(location.pathname);
    mapbox.setLayers(section, mapViewer);

    // Update the map parent layer and color of the current page.
    const mapSection = mapSections.find((sec) => sec.id === section)!;
    setParentLayer(mapSection.parentLayer);
    setColor(mapSection.color);

    return () => {
      setParentLayer("");
      setColor(undefined);
    };
  }, [location.pathname, mapViewer, setColor, setParentLayer]);

  // Toggle map viewer between satellite and map.
  useEffectAfterMount(() => {
    if (!mapViewer || !mapPreview) return;

    const styleUrl =
      mapMode === "satellite"
        ? mapConfigs.style.satellite
        : mapConfigs.style.map;
    mapViewer.setStyle(styleUrl);
  }, [mapMode]);

  return <div id="map" ref={mapContainerRef} className={styles.map}></div>;
}
