import mapboxgl from "mapbox-gl";
import styles from './Map.module.css';
import { accessToken, configs } from "../config";
import { useEffect } from "react";

export default function Map() {
  useEffect(() => {
    mapboxgl.accessToken = accessToken;

    const bounds: mapboxgl.LngLatBoundsLike = [
      [-85, 36], // Southwest coordinates
      [-65, 48], // Northeast coordinates
    ];
    const [longitude, latitude] = configs.map.location.center;

    const map = new mapboxgl.Map({
      container: "map",
      style: configs.map.style,
      center: [longitude, latitude],
      zoom: configs.map.location.zoom,
      bearing: configs.map.location.bearing,
      pitch: configs.map.location.pitch,
      scrollZoom: true,
      maxBounds: bounds,
    });
    
    // Disable rotation using touch and mouse
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();

    // Cleanup function to remove the map instance on component unmount
    return () => map.remove();
  }, [])

  return (
    <div id="map" className={styles.map}></div>
  )
}