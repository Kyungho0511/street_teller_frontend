import * as Cesium from "cesium";
import { GOOGLE_3D_TILES_ID } from "../constants/3DTilesConstants";

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
