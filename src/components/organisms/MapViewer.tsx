import styles from './MapViewer.module.css';
import { useContext, useEffect, useRef } from "react";
import * as mapbox from "../../services/mapbox";
import { useLocation } from 'react-router-dom';
import { pathToSection } from '../../utils/utils';
import { CameraContext, CameraState } from '../../context/CameraContext';
import { ViewerContext } from '../../context/ViewerContext';
import { mapSections } from '../../constants/mapConstants';
import { Section } from '../../constants/surveyConstants';
import useEffectAfterMount from '../../hooks/useEffectAfterMount';

/**
 * Mapbox map viewer component.
 */
export default function MapViewer() {
  const { mapViewer, setMapViewer, setParentLayer, setColor, mapMode, satelliteViewer } = useContext(ViewerContext);
  const { cameraState, setCameraState, syncSatelliteCamera } = useContext(CameraContext);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Create a map instance on component mount.
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const temp = mapbox.createMap(mapContainerRef.current.id);
    temp.on("load", () => {
      setMapViewer(temp);
    });
    // Cleanup function to remove the map instance on component unmount
    return () => {
      mapViewer && mapbox.removeMap(mapViewer);
      setMapViewer(undefined);
    };
  }, []);

  // Update the camera state when the map ends moving.
  useEffectAfterMount(() => {
    if (!mapViewer) return;
    const onMoveEnd = () => {
      const center = mapViewer.getCenter();
      setCameraState({
        center: [center.lng, center.lat],
        zoom: mapViewer.getZoom(),
        bearing: mapViewer.getBearing(),
        pitch: mapViewer.getPitch(),
      } as CameraState);

      // if (!satelliteViewer) return;
      // syncSatelliteCamera(satelliteViewer, cameraState)
    };

    mapViewer.on('moveend', onMoveEnd);

    return () => {
      mapViewer.off('moveend', onMoveEnd);
    };
  }, [mapViewer, setCameraState]);


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
      }
  }, [location.pathname, mapViewer, setColor, setParentLayer]);

  // Resize the map when its display mode changes.
  useEffectAfterMount(() => {
    if (!mapViewer) return;
    mapViewer.resize();
  }, [mapMode, mapViewer]);

  /**
   * Adding Google 3D tiles through mapbox custom three.js layer works.
   * However, syncing coordinate system between mapbox and Google 3D tiles
   * is not working. Therefore, this part is disabled. TO be fixed later.
   */
  // useEffectAfterMount(() => {
  //   if (!map) return;

  //   // Add three.js custom layer to the map.
  //   const custom3DLayer = create3DLayer("3d-layer", 1, MODEL_URL);
  //   map.addLayer(custom3DLayer, OUTLINE_LAYER);
    
  //   return () => {
  //     map.removeLayer("3d-layer");
  //   }
  // }, [map]);

  return (
    <div
      id="map"
      ref={mapContainerRef}
      className={styles.map}
      style={{
        display: mapMode == "map" ? 'block' : 'none',
      }}
    >
    </div>
  );
}
