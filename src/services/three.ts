import {
  GLTF,
  GLTFLoader,
} from "./../../node_modules/@types/three/examples/jsm/loaders/GLTFLoader.d";
import * as THREE from "three";
import mapboxgl from "mapbox-gl";
import { configs } from "../constants/mapConstants";

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
  map: mapboxgl.Map;
};

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
  scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
};

export function create3DLayer(map: mapboxgl.Map) {
  const custom3DLayer: Custom3DLayer = {
    id: "3d-nyc",
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

      // use the three.js GLTF loader to add the 3D model to the three.js scene
      const loader = new GLTFLoader();
      loader.load(
        "https://docs.mapbox.com/mapbox-gl-js/assets/34M_17/34M_17.gltf",
        (gltf: GLTF) => {
          gltf.scene.scale.set(100, 100, 100);
          this.scene.add(gltf.scene);
        }
      );
      this.map = map;

      // Use the Mapbox GL JS map canvas for three.js
      this.renderer = new THREE.WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl,
        antialias: true,
      });
      this.renderer.autoClear = false;
    },

    render: function (gl: WebGLRenderingContext, matrix: number[]) {
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
      this.renderer.resetState();
      this.renderer.render(this.scene, this.camera);
      this.map.triggerRepaint();
    },
  };

  map.addLayer(custom3DLayer, "tracts-features-nyc-outline");
}
