import * as Cesium from "cesium";
import {
  ALTITUDE,
  BEARING,
  GOOGLE_3D_TILES_ID,
  OFFSET_X,
  OFFSET_Y,
  PITCH,
  ROLL,
} from "../constants/map3DConstants";
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

  // These settings advance the clock time.
  viewer.clock.canAnimate = true;
  viewer.clock.shouldAnimate = true;

  // Remove existing credits and cesium logo for now.
  // TODO: Add custom cesium credit. https://cesium.com/docs/cesiumjs-ref-doc/Credit.html
  // Double check if I am using any assets that require credits.
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
 * @param position - The position to set the camera view.
 */
export function setView(target: Position, cesiumViewer: Cesium.Viewer): void {
  const targetCartesian = mapboxPositionToCartesian(target);
  const targetOffset = new Cesium.Cartesian3(OFFSET_X, OFFSET_Y, ALTITUDE);
  cesiumViewer.camera.lookAt(targetCartesian, targetOffset);
}

/**
 * Auto rotate the camera in X and Y axis.
 * @param target - The target axis of the rotation.
 * @param speed - The speed of the rotation.
 * @returns A function to remove the auto rotation event.
 */
export function enableAutoRotate(
  target: Position,
  speed: number,
  cesiumViewer: Cesium.Viewer
): () => void {
  const targetCartesian = mapboxPositionToCartesian(target);

  const rotateListener = () => {
    const deltaTime =
      cesiumViewer.clock.currentTime.secondsOfDay -
      cesiumViewer.clock.startTime.secondsOfDay;
    const targetOffset = new Cesium.Cartesian3(
      OFFSET_X * Math.cos(deltaTime * speed),
      OFFSET_Y * Math.sin(deltaTime * speed),
      ALTITUDE
    );
    cesiumViewer.scene.camera.lookAt(targetCartesian, targetOffset);
  };

  cesiumViewer.clock.onTick.addEventListener(rotateListener);

  return () => {
    cesiumViewer.clock.onTick.removeEventListener(rotateListener);
  };
}

/**
 * Convert a Mapbox position to a Cesium Cartesian3 position.
 * @param position - The mapbox position to convert.
 */
export function mapboxPositionToCartesian(position: Position) {
  const cartographic = new Cesium.Cartographic(
    Cesium.Math.toRadians(position[0]), // longitude
    Cesium.Math.toRadians(position[1]), // latitude
    100
  );
  return Cesium.Ellipsoid.WGS84.cartographicToCartesian(cartographic);
}

/**
 * Convert a Mapbox position to a Cesium Cartesian3 position with Terrain height.
 * @param position - The mapbox position to convert.
 */
export async function mapboxPositionToCartesianTerrain(
  position: Position,
  cesiumViewer: Cesium.Viewer
): Promise<Cesium.Cartesian3> {
  const cartographic = await Cesium.sampleTerrainMostDetailed(
    cesiumViewer.terrainProvider,
    [
      new Cesium.Cartographic(
        Cesium.Math.toRadians(position[0]), // longitude
        Cesium.Math.toRadians(position[1]) // latitude
      ),
    ]
  );

  return Cesium.Ellipsoid.WGS84.cartographicToCartesian(cartographic[0]);
}
