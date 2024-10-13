import * as THREE from "three";
import mapboxgl from "mapbox-gl";
import { configs } from "../constants/mapConstants";
import { DRACOLoader, GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";
import { TilesRenderer } from "3d-tiles-renderer";

const apiKeyGoogle = import.meta.env.VITE_API_KEY_GOOGLE as string;

export type ModelTransform = {
  translateX: number;
  translateY: number;
  translateZ: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scale: number;
};

export type Custom3DLayer = mapboxgl.CustomLayerInterface & {
  camera: THREE.Camera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  tilesRenderer: TilesRenderer;
  map: mapboxgl.Map;
};

/**
 * Create a 3d custom layer on the map.
 * @param name Name of the 3d layer.
 * @param scaleModifier Scale modifier of the 3d model.
 * @param url Url path of the 3d model.
 * @param map Map in which the 3d layer is created.
 */
export function create3DLayer(
  name: string,
  scaleModifier: number,
  url: string,
  map: mapboxgl.Map
): Custom3DLayer {

  // Settings for 3d model object.
  const modelOrigin: [number, number] = [
    configs.location.center[0],
    configs.location.center[1],
  ];
  const modelAltitude = 0;
  const modelRotate = [Math.PI / 2, 0, 0];

  const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
    modelOrigin,
    modelAltitude
  );
  const modelTransform: ModelTransform = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: modelRotate[0],
    rotateY: modelRotate[1],
    rotateZ: modelRotate[2],
    scale:
      modelAsMercatorCoordinate.meterInMercatorCoordinateUnits() *
      scaleModifier,
  };

  // Initialize three.js scene and camera.
  // const sceneThree = new THREE.Scene();
  // const cameraThree = new THREE.PerspectiveCamera(
  //   45,
  //   window.innerWidth / window.innerHeight,
  //   0.1,
  //   2000
  // );

  // Create a custom 3D layer.
  const custom3DLayer: Custom3DLayer = {
    id: name,
    type: "custom",
    renderingMode: "3d",
    onAdd: function (map: mapboxgl.Map, gl: WebGLRenderingContext) {
      this.camera = new THREE.Camera();
      this.scene = new THREE.Scene();

      // create lights to illuminate the model
      const directionalLight = new THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(0, -70, 100).normalize();
      this.scene.add(directionalLight);

      const directionalLight2 = new THREE.DirectionalLight(0xffffff);
      directionalLight2.position.set(0, 70, 100).normalize();
      this.scene.add(directionalLight2);

      // // use the three.js GLTF loader to add the 3D model to the three.js scene
      // const loader = new GLTFLoader();
      // loader.load(url, (gltf: GLTF) => {
      //   this.scene.add(gltf.scene);
      // });
      // this.map = map;

      // Use the Mapbox GL JS map canvas for three.js
      this.renderer = new THREE.WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl,
        antialias: true,
      });
      this.renderer.autoClear = false;

      // Set up the 3D Tiles renderer
      this.tilesRenderer = new TilesRenderer(`https://tile.googleapis.com/v1/3dtiles/root.json?key=${apiKeyGoogle}`);
      this.tilesRenderer.setCamera(this.camera);
      this.tilesRenderer.setResolutionFromRenderer(this.camera, this.renderer);

      // DRACO loader is required for loading Google 3D Tiles
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
      dracoLoader.setDecoderConfig({ type: "js" });
      const loader = new GLTFLoader(this.tilesRenderer.manager);
      loader.setDRACOLoader(dracoLoader);
      this.tilesRenderer.manager.addHandler(/\.(gltf|glb)$/g, loader);

      // Process URLs to include the API key and session Id 
      // for all subsequent requests excep the blob URLs.
      let session: string | null = null;
      this.tilesRenderer.preprocessURL = (url) => {
        url = url as string;
        if (url.includes('session=')) session = url.split('session=')[1];

        if (!url.includes('blob:')) {
          url = session ? url + `${getSeparator(url)}session=${session}` : url;
          url += `${getSeparator(url)}key=${apiKeyGoogle}`;
        }

        return url;
      };

      this.tilesRenderer.manager.onStart = (url, itemsLoaded, itemsTotal) => {
        console.log(`Started loading ${url}, ${itemsLoaded} of ${itemsTotal}`);
      }
      this.tilesRenderer.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
        console.log(`Loading ${url}: ${itemsLoaded} of ${itemsTotal}`);
      }
      this.tilesRenderer.manager.onError = (url) => {
        console.log(`Error loading ${url}`);
      }
      this.tilesRenderer.manager.onLoad = () => console.log('All items loaded');


      this.scene.add(this.tilesRenderer.group);
    },

    render: function (gl: WebGLRenderingContext, matrix: number[]) {

      // Update camera matrix to ensure the model is georeferenced
      const rotationX = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(1, 0, 0),
        modelTransform.rotateX
      );
      const rotationY = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 1, 0),
        modelTransform.rotateY
      );
      const rotationZ = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 0, 1),
        modelTransform.rotateZ
      );

      const m = new THREE.Matrix4().fromArray(matrix);
      const l = new THREE.Matrix4()
        .makeTranslation(
          modelTransform.translateX,
          modelTransform.translateY,
          modelTransform.translateZ
        )
        .scale(
          new THREE.Vector3(
            modelTransform.scale,
            -modelTransform.scale,
            modelTransform.scale
          )
        )
        .multiply(rotationX)
        .multiply(rotationY)
        .multiply(rotationZ);

      this.camera.projectionMatrix = m.multiply(l);
      
      // Render the scene
      this.tilesRenderer.update();
      this.renderer.resetState();
      this.renderer.render(this.scene, this.camera);

      // Request the map to repaint.
      // this.map.triggerRepaint();
    },
  };

  return custom3DLayer;
}

/**
 * 
 * @param url 
 */
function getSeparator(url: string) {
  return url.includes('?') ? '&' : '?';
}