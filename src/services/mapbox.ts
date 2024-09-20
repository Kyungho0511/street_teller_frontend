import { KMeansLayer } from './kmeans';
import mapboxgl from "mapbox-gl";
import { Color, configs, MapBound, MapLayer, mapSections } from "../constants/mapConstants";
import { ClusterList, Section } from "../constants/surveyConstants";
import * as utils from "../utils/utils";
import { HealthcarePropertyName } from '../constants/geoJsonConstants';

/**
 * Create a mapbox map instance.
 */
export function CreateMap(): mapboxgl.Map {
  mapboxgl.accessToken = import.meta.env.VITE_API_KEY_MAPBOX as string;
  const bounds: mapboxgl.LngLatBoundsLike = [
    [-85, 36], // Southwest coordinates
    [-65, 48], // Northeast coordinates
  ];
  const [longitude, latitude] = configs.location.center;

  const map = new mapboxgl.Map({
    container: "map",
    style: configs.style,
    center: [longitude, latitude],
    zoom: configs.location.zoom,
    bearing: configs.location.bearing,
    pitch: configs.location.pitch,
    scrollZoom: true,
    maxBounds: bounds,
  });
  
  // Disable rotation using touch and mouse
  map.dragRotate.disable();
  map.touchZoomRotate.disableRotation();

  return map;
}

/**
 * Remove the mapbox map instance.
 */
export function RemoveMap(map: mapboxgl.Map): void {
  map.remove();
}

/**
 * Get the paint type of the mapbox layer.
 */
export function getLayerPaintType(layer: MapLayer, map: mapboxgl.Map): string[] | undefined {
  // Exit if the layer type is not found.
  const layerType = map.getLayer(layer.name)?.type;
  if (!layerType) return;

  switch (layerType) {
    case "fill":
      return ["fill-opacity"];
    case "line":
      return ["line-opacity"];
    case "circle":
      return ["circle-opacity", "circle-stroke-opacity"];
    case "symbol":
      return ["icon-opacity", "text-opacity"];
    case "raster":
      return ["raster-opacity"];
    case "background":
      return ["background-opacity"];
    case "fill-extrusion":
      return ["fill-extrusion-opacity"];
    default:
      return;
  }  
}

/**
 * Set the opacity of the mapbox layer.
 */
export function setLayerOpacity(layer: MapLayer, map: mapboxgl.Map): void {
  const paintProps: string[] | undefined = getLayerPaintType(layer, map);
  paintProps && paintProps.forEach(function (prop) {
    map.setPaintProperty(layer.name, prop, layer.opacity);
  });
}

/**
 * Turn on layers based on the section.
 */
export function setLayers(section: Section, map: mapboxgl.Map): void {
  
  // Exit if the section is not found.
  const mapSection = mapSections.find((sec) => sec.id === section);
  if (!mapSection) return;

  // Update layer opacity.
  offLayers(map);
  mapSection.layers.forEach((layer) => setLayerOpacity(layer, map));

  // Home: Update layer style, adjusting the color interpolation.
  if (section === "home") {
    const name = mapSection.attribute!.name;
    updateLayerAttribute(
      mapSection.attributeParentLayer!,
      name,
      mapSection.color!,
      map
    );
  }
}

/**
 * Update attribute of the mapbox layer to be drawn.
 */
export function updateLayerAttribute(
  layer: string,
  attribute: HealthcarePropertyName,
  color: Color,
  map: mapboxgl.Map
) {
  const bound: MapBound = utils.getBound(attribute)!;
  map.setPaintProperty(layer, "fill-color", [
    "interpolate",
    bound.rateOfChange,
    ["get", attribute],
    bound.min,
    color.min,
    bound.max,
    color.max,
  ]);
}

/**
 * Add a k-means cluster layer to the mapbox map.
 */
export function addClusterLayer(kMeansLayer: KMeansLayer, map: mapboxgl.Map) {
  map.addSource(kMeansLayer.title, {
      type: "geojson",
      data: kMeansLayer.geoJson,
    });
  map.addLayer(
    {
      id: kMeansLayer.title,
      type: "fill",
      source: kMeansLayer.title,
      paint: {
        "fill-color": [
          "case",
          ["==", ["get", "cluster"], 0],
          kMeansLayer.colors[0],
          ["==", ["get", "cluster"], 1],
          kMeansLayer.colors[1],
          ["==", ["get", "cluster"], 2],
          kMeansLayer.colors[2],
          ["==", ["get", "cluster"], 3],
          kMeansLayer.colors[3],
          "#ffffff",
        ],
        "fill-opacity": 1,
        "fill-outline-color": "rgba(217, 217, 217, 0.36)",
      },
    },
    "road-simple"
  );
}

/**
 * Remove a k-means cluster layer from the mapbox map.
 */
export function removeClusterLayer(kMeansLayer: KMeansLayer, map: mapboxgl.Map) {
  map.removeLayer(kMeansLayer.title);
  map.removeSource(kMeansLayer.title);
}

/**
 * Update a k-means cluster layer color style on the mapbox map.
 * @param clusterList Informs which clusters are selected.
 */
export function updateClusterLayer(clusterList: ClusterList, map?: mapboxgl.Map) {
  if (map && map.getLayer(clusterList.name)) {
    const list = clusterList.list;
    map.setPaintProperty(clusterList.name, "fill-color", [
      "case",
      ["==", ["get", "cluster"], 0],
      list[0].checked ? list[0].color : "#ffffff",
      ["==", ["get", "cluster"], 1],
      list[1].checked ? list[1].color : "#ffffff",
      ["==", ["get", "cluster"], 2],
      list[2].checked ? list[2].color : "#ffffff",
      ["==", ["get", "cluster"], 3],
      list[3].checked ? list[3].color : "#ffffff",
      "#ffffff",
    ])
  }
}

/**
 * Turn off all layers by setting opacity to 0.
 */
function offLayers(map: mapboxgl.Map) {
  mapSections.forEach((sec) => {
    sec.layers.forEach((layer) => {
      setLayerOpacity({ name: layer.name, opacity: 0 }, map);
    });
  });
}