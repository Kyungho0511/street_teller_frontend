import styles from "./MapViewer.module.css";
import { useContext, useEffect, useRef } from "react";
import * as mapbox from "../../services/mapbox";
import { useLocation } from "react-router-dom";
import { pathToSection } from "../../utils/utils";
import { MapContext } from "../../context/MapContext";
import { mapConfigs, TRACTS_SOURCE } from "../../constants/mapConstants";
import { sectionMapConfigs } from "../../constants/sectionConstants";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import useGeoJson from "../../hooks/useGeoJson";
import { geoJsonFilePath } from "../../constants/geoJsonConstants";
import { map } from "framer-motion/client";

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
    geoJson,
    setSourceLoaded,
    setLocation,
  } = useContext(MapContext);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const section = pathToSection(location.pathname);
  useGeoJson(geoJsonFilePath);

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
      setMapSettings();
    });

    return () => {
      mapViewer && mapbox.removeMap(mapViewer);
      setMapViewer(undefined);
    };
  }, []);

  // Temp testing code!!!!!!
  // Temp testing code!!!!!!
  // Temp testing code!!!!!!
  useEffect(() => {
    if (!mapViewer) return;
    mapViewer.on("click", (e) => {
      const features = mapViewer.queryRenderedFeatures(e.point);
      const clusterLayers = ["cluster1", "cluster2", "cluster3"];
      features.forEach((feature) => {
        if (feature.layer && clusterLayers.includes(feature.layer.id)) {
          console.log(feature);
        }
      });
    });
  }, [mapViewer]);

  // Add geojson data to the map source
  useEffectAfterMount(() => {
    if (!mapViewer || !geoJson) return;

    const callbackFn = async () => {
      await mapbox.addSource(geoJson, TRACTS_SOURCE, mapViewer);
      setSourceLoaded(true);
    };
    callbackFn();
  }, [mapViewer, geoJson]);

  // Update map settings on page change.
  useEffectAfterMount(() => {
    if (!mapViewer) return;

    setMapSettings();
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

  function setMapSettings() {
    // Update the map parent layer and color of the current page.
    const mapSec = sectionMapConfigs.find((sec) => sec.id === section)!;
    setParentLayer(mapSec.parentLayer);
    setColor(mapSec.color);
  }

  return <div id="map" ref={mapContainerRef} className={styles.map}></div>;
}
