import * as Cesium from "cesium";
import { GOOGLE_3D_TILES_ID } from "../constants/3DTilesConstants";
import { Position } from "geojson";

/**
 * Create a 3D map instance using Cesium.
 */
export async function createMap3D(
  map3dContainerRef: React.RefObject<HTMLDivElement>,
  map3dRef: React.MutableRefObject<Cesium.Viewer | undefined>
): Promise<Cesium.Viewer> {
  Cesium.Ion.defaultAccessToken = import.meta.env.VITE_API_KEY_CESIUM as string;
  map3dRef.current = new Cesium.Viewer(map3dContainerRef.current as Element, {
    skyAtmosphere: new Cesium.SkyAtmosphere(),
    scene3DOnly: true,
    globe: false,
    sceneModePicker: false,
    selectionIndicator: false,
    baseLayerPicker: false,
    animation: false,
    timeline: false,
    navigationHelpButton: false,
    infoBox: false,
    geocoder: false,
    fullscreenButton: false,
    homeButton: false,
    vrButton: false,
    targetFrameRate: 60,
    showRenderLoopErrors: false,
  });
  const viewer = map3dRef.current;
  viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT;

  // Remove existing credits and cesium logo
  const creditContainer = viewer.cesiumWidget.creditContainer as HTMLElement;
  creditContainer.style.display = "none";

  try {
    const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(
      GOOGLE_3D_TILES_ID
    );
    viewer.scene.primitives.add(tileset);
  } catch (error) {
    console.error(error);
  }
  viewer.resize();
  viewer.render();

  return viewer;
}

/**
 * Set camera view to a specific position on the 3D map.
 */
export function setView(position: Position, cesiumViewer: Cesium.Viewer) {
  console.log(position);

  const altitude = 250; // in meters
  const pitch = -45; // in degrees
  const bearing = 0; // in degrees
  const roll = 0; // in degrees

  const cartographic = new Cesium.Cartographic(
    Cesium.Math.toRadians(position[0]), // longitude
    Cesium.Math.toRadians(position[1]), // latitude
    altitude
  );

  cesiumViewer.camera.setView({
    destination: Cesium.Ellipsoid.WGS84.cartographicToCartesian(cartographic),
    orientation: {
      heading: bearing,
      pitch: Cesium.Math.toRadians(pitch),
      roll,
    },
  });
}
