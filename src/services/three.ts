// import { label } from './../../node_modules/@types/three/src/nodes/core/ContextNode.d';
// import * as THREE from "three";
// import mapboxgl from "mapbox-gl";
// import { configs } from "../constants/mapConstants";
// import { DRACOLoader, GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";
// import { GooglePhotorealisticTilesRenderer, TilesRenderer } from "3d-tiles-renderer";

// const apiKeyGoogle = import.meta.env.VITE_API_KEY_GOOGLE as string;

// export type ModelTransform = {
//   translateX: number;
//   translateY: number;
//   translateZ: number;
//   rotateX: number;
//   rotateY: number;
//   rotateZ: number;
//   scale: number;
// };

// export type Custom3DLayer = mapboxgl.CustomLayerInterface & {
//   camera: THREE.Camera;
//   scene: THREE.Scene;
//   renderer: THREE.WebGLRenderer;
//   tilesRenderer: GooglePhotorealisticTilesRenderer;
//   map: mapboxgl.Map;
// };

// /**
//  * Create a 3d custom layer on the map.
//  * @param name Name of the 3d layer.
//  * @param scaleModifier Scale modifier of the 3d model.
//  * @param url Url path of the 3d model.
//  */
// export function create3DLayer(
//   name: string,
//   scaleModifier: number,
//   url: string,
// ): Custom3DLayer {

//   // Settings for 3d model object.
//   const modelOrigin: [number, number] = [
//     configs.location.center[0],
//     configs.location.center[1],
//   ];
//   const modelAltitude = 0;

//   const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
//     {lng: modelOrigin[0], lat: modelOrigin[1]},
//     modelAltitude
//   );
//   const modelTransform: ModelTransform = {
//     translateX: modelAsMercatorCoordinate.x,
//     translateY: modelAsMercatorCoordinate.y,
//     translateZ: modelAsMercatorCoordinate.z,
//     rotateX: Math.PI / 2,
//     rotateY: 0,
//     rotateZ: 0,
//     scale:
//       modelAsMercatorCoordinate.meterInMercatorCoordinateUnits() *
//       scaleModifier,
//   };

//   // Create a custom 3D layer.
//   const custom3DLayer: Custom3DLayer = {
//     id: name,
//     type: "custom",
//     renderingMode: "3d",
//     onAdd: function (map: mapboxgl.Map, gl: WebGLRenderingContext) {
//       this.camera = new THREE.Camera();
//       this.scene = new THREE.Scene();
//       this.map = map;

//       // Use the Mapbox GL JS map canvas for three.js
//       this.renderer = new THREE.WebGLRenderer({
//         canvas: map.getCanvas(),
//         context: gl,
//         antialias: true,
//       });
//       this.renderer.autoClear = false;

//       // Set up the 3D Tiles renderer. Google photorealistic 
//       // 3D Tiles come with textures including baked lighting and 
//       // shadows. Therefore, the renderer does not need to use lights.
//       this.tilesRenderer = new GooglePhotorealisticTilesRenderer(`https://tile.googleapis.com/v1/3dtiles/root.json?key=${apiKeyGoogle}`);
//       this.tilesRenderer.setCamera(this.camera);
//       this.tilesRenderer.setResolutionFromRenderer(this.camera, this.renderer);

//       // DRACO loader is required for loading Google 3D Tiles for decompression.
//       const dracoLoader = new DRACOLoader();
//       dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
//       dracoLoader.setDecoderConfig({ type: "js" });
//       const loader = new GLTFLoader(this.tilesRenderer.manager);
//       loader.setDRACOLoader(dracoLoader);
//       this.tilesRenderer.manager.addHandler(/\.(gltf|glb)$/g, loader);

//       // Process URLs to include the API key and session Id 
//       // for all subsequent requests excep the blob URLs.
//       let session: string | null = null;
//       this.tilesRenderer.preprocessURL = (url) => {
//         url = url as string;
//         if (url.includes('session=')) session = url.split('session=')[1];

//         if (!url.includes('blob:')) {
//           url = session ? url + `${getSeparator(url)}session=${session}` : url;
//           url += `${getSeparator(url)}key=${apiKeyGoogle}`;
//         }
//         return url;
//       };

//       this.tilesRenderer.setLatLonToYUp(modelOrigin[1], modelOrigin[0]);

//       // Add the tiles renderer group to the scene
//       this.scene.add(this.tilesRenderer.group);

//       // // Transform the model to the correct position
//       // this.tilesRenderer.manager.onLoad = () => {
//       //   console.log("All models loaded");
//       //   const boundingSphere = new THREE.Sphere();
//       //   if (this.tilesRenderer.getBoundingSphere(boundingSphere)) {
//       //     const centerECEF = boundingSphere.center;
//       //     const centerGeographic = ecefToGeographic(centerECEF);
//       //     console.log(centerGeographic.longitude)
//       //     const centerPoint = this.map.project([centerGeographic.longitude, centerGeographic.latitude]);
//       //     this.tilesRenderer.group.position.set(0, 0, 10);
//       //   }
//       // };

//       // Logs for debugging
//       this.tilesRenderer.manager.onStart = (url, itemsLoaded, itemsTotal) => {
//         console.log(`Started loading ${url}, ${itemsLoaded} of ${itemsTotal}`);
//       }
//       this.tilesRenderer.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
//         console.log(`Loading ${url}: ${itemsLoaded} of ${itemsTotal}`);
//       }
//       this.tilesRenderer.manager.onError = (url) => {
//         console.log(`Error loading ${url}`);
//       }
//       this.tilesRenderer.manager.onLoad = () => {
//         console.log("All models loaded");
//       }
//     },

//     render: function (gl: WebGLRenderingContext, matrix: number[]) {

//       // Update camera matrix to ensure the model is georeferenced
//       const rotationX = new THREE.Matrix4().makeRotationAxis(
//         new THREE.Vector3(1, 0, 0),
//         modelTransform.rotateX
//       );
//       const rotationY = new THREE.Matrix4().makeRotationAxis(
//         new THREE.Vector3(0, 1, 0),
//         modelTransform.rotateY
//       );
//       const rotationZ = new THREE.Matrix4().makeRotationAxis(
//         new THREE.Vector3(0, 0, 1),
//         modelTransform.rotateZ
//       );

//       const m = new THREE.Matrix4().fromArray(matrix);
//       const l = new THREE.Matrix4()
//         .makeTranslation(
//           modelTransform.translateX,
//           modelTransform.translateY,
//           modelTransform.translateZ
//         )
//         .scale(
//           new THREE.Vector3(
//             modelTransform.scale,
//             -modelTransform.scale,
//             modelTransform.scale
//           )
//         )
//         .multiply(rotationX)
//         .multiply(rotationY)
//         .multiply(rotationZ);

//       this.camera.projectionMatrix = m.multiply(l);
      
//       // Render the scene
//       this.tilesRenderer.update();
//       this.renderer.resetState();
//       this.renderer.render(this.scene, this.camera);

//       // Request the map to repaint.
//       this.map.triggerRepaint();
//     },
//   };

//   return custom3DLayer;
// }

// function getSeparator(url: string) {
//   return url.includes('?') ? '&' : '?';
// }

// function ecefToGeographic(position: THREE.Vector3): { latitude: number, longitude: number, altitude: number } {
//   const x = position.x;
//   const y = position.y;
//   const z = position.z;
//   const a = 6378137.0; // Earth's semi-major axis in meters
//   const e = 8.1819190842622e-2; // Eccentricity

//   const asq = Math.pow(a, 2);
//   const esq = Math.pow(e, 2);
//   const b = Math.sqrt(asq * (1 - esq));
//   const bsq = Math.pow(b, 2);
//   const ep = Math.sqrt((asq - bsq) / bsq);
//   const p = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
//   const th = Math.atan2(a * z, b * p);
//   const lon = Math.atan2(y, x);
//   const lat = Math.atan2(
//     z + Math.pow(ep, 2) * b * Math.pow(Math.sin(th), 3),
//     p - esq * a * Math.pow(Math.cos(th), 3)
//   );
//   const N = a / Math.sqrt(1 - esq * Math.pow(Math.sin(lat), 2));
//   const alt = p / Math.cos(lat) - N;

//   return {
//     latitude: THREE.MathUtils.radToDeg(lat),
//     longitude: THREE.MathUtils.radToDeg(lon),
//     altitude: alt,
//   };
// }