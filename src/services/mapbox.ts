import mapboxgl from "mapbox-gl";
import { Color, configs, MapBound, MapLayer, mapSections } from "../constants/mapConstants";
import { Section } from "../constants/surveyConstants";
import * as utilities from "./utilities";

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
    updateLayerStyle(
      mapSection.attributeParentLayer!,
      name,
      mapSection.color!,
      map
    );
  }
}

/**
 * Visualize the input attribute of the mapbox layer.
 */
export function updateLayerStyle(
  layer: string,
  attribute: string,
  color: Color,
  map: mapboxgl.Map
) {
  const bound: MapBound = utilities.getBound(attribute)!;
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
 * Turn off all layers by setting opacity to 0.
 */
function offLayers(map: mapboxgl.Map) {
  mapSections.forEach((sec) => {
    sec.layers.forEach((layer) => {
      setLayerOpacity({ name: layer.name, opacity: 0 }, map);
    });
  });
}