import mapboxgl from "mapbox-gl";
import { Color, configs, LayerBound, MapLayer, sections } from "../constants/mapConstants";
import { Section } from "./navigate";

// const accessToken =

export function CreateMap(): mapboxgl.Map {
  mapboxgl.accessToken = accessToken;
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

export function RemoveMap(map: mapboxgl.Map): void {
  map.remove();
}

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

export function setLayerOpacity(layer: MapLayer, map: mapboxgl.Map): void {
  const paintProps: string[] | undefined = getLayerPaintType(layer, map);
  paintProps && paintProps.forEach(function (prop) {
    map.setPaintProperty(layer.name, prop, layer.opacity);
  });
}

// Turn on layers based on the section.
export function setLayers(section: Section, map: mapboxgl.Map): void {
  
  // Exit if the section is not found.
  const mapSection = sections.find((sec) => sec.id === section);
  if (!mapSection) return;

  // Update layer opacity.
  offLayers(map);
  mapSection.layers.forEach((layer) => setLayerOpacity(layer, map));

  // Update layer style, adjusting the color interpolation.
  if (section === "home") {
    const { name, color, bound, parent } = mapSection.attribute!;
    updateLayerStyle(
      parent,
      name,
      bound,
      color,
      map
    );
  }
}

// Turn off all layers with opacity 0.
function offLayers(map: mapboxgl.Map) {
  sections.forEach((sec) => {
    sec.layers.forEach((layer) => {
      setLayerOpacity({ name: layer.name, opacity: 0 }, map);
    });
  });
}

export function updateLayerStyle(
  layer: string,
  attribute: string,
  bound: LayerBound,
  color: Color,
  map: mapboxgl.Map
) {
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
