import {
  Color,
  mapConfigs,
  MapBound,
  MapLayer,
  transparent,
  ZOOM_MODIFIER,
} from "../constants/mapConstants";
import { sectionMapConfigs } from "../constants/sectionConstants";
import { Report, ClusterList } from "../constants/surveyConstants";
import { Section } from "../constants/sectionConstants";
import * as utils from "../utils/utils";
import {
  HealthcareFeatureCollection,
  HealthcarePropertyName,
} from "../constants/geoJsonConstants";
import { MapMode } from "../context/MapContext";
import { KMeansLayer } from "../constants/kMeansConstants";
import mapboxgl from "mapbox-gl";
import * as mapboxgljs from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

/**
 * Create a mapbox map instance.
 */
export function createMap(
  mapContainerId: string,
  mapMode: MapMode,
  simple: boolean
): mapboxgl.Map {
  mapboxgl.accessToken = import.meta.env.VITE_API_KEY_MAPBOX as string;
  const bounds: mapboxgl.LngLatBoundsLike = [
    [-85, 36], // Southwest coordinates
    [-65, 48], // Northeast coordinates
  ];

  let style;
  if (simple) {
    style =
      mapMode === "map"
        ? mapConfigs.style.mapSimple
        : mapConfigs.style.satelliteSimple;
  } else {
    style =
      mapMode === "map" ? mapConfigs.style.map : mapConfigs.style.satellite;
  }

  const map = new mapboxgl.Map({
    container: mapContainerId,
    style,
    center: mapConfigs.location.center,
    zoom: simple
      ? mapConfigs.location.zoom - ZOOM_MODIFIER
      : mapConfigs.location.zoom,
    bearing: mapConfigs.location.bearing,
    pitch: mapConfigs.location.pitch,
    scrollZoom: true,
    maxBounds: bounds,
    attributionControl: false,
    projection: "globe",
  });
  map.dragRotate.disable();
  map.touchPitch.disable();

  return map;
}

/**
 * Remove the mapbox map instance.
 * @param map Map to remove.
 */
export function removeMap(map: mapboxgl.Map): void {
  map.remove();
}

/**
 * Get the paint type of the mapbox layer.
 */
export function getLayerPaintType(
  layer: MapLayer,
  map: mapboxgl.Map
): string[] | undefined {
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
 * @param layer mapbox layer to set opacity.
 * @param map Map in which layer opacity is set.
 */
export function setLayerOpacity(layer: MapLayer, map: mapboxgl.Map): void {
  const paintProps: string[] | undefined = getLayerPaintType(layer, map);
  paintProps &&
    paintProps.forEach(function (prop) {
      map.setPaintProperty(layer.name, prop, layer.opacity);
    });
}

/**
 * Turn on layers based on the section.
 * @param section Each url path corresponds to a section.
 * @param map Map in which layers are set.
 */
export function setLayers(section: Section, map: mapboxgl.Map): void {
  // Exit if the section is not found.
  const mapSection = sectionMapConfigs.find((sec) => sec.id === section);
  if (!mapSection) return;

  // Update layer opacity.
  offLayers(map);
  mapSection.layers.forEach((layer) => setLayerOpacity(layer, map));

  // Home: Update layer style, adjusting the color interpolation.
  if (section === "home") {
    const name = mapSection.attribute!.name;
    updateLayerAttribute(mapSection.parentLayer!, name, mapSection.color!, map);
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
    utils.rgbaToString(color.min),
    bound.max,
    utils.rgbaToString(color.max),
  ]);
}

/**
 * Update a k-means cluster layer color style on the mapbox map.
 * @param clusterId clustering iteration number.
 * @param clusterList Informs which clusters are selected.
 * @param map Map to which the layer is updated.
 */
export function updateClusterLayer(
  clusterId: string,
  clusterList: ClusterList,
  map?: mapboxgl.Map
) {
  if (map && map.getLayer(clusterList.name)) {
    const list = clusterList.list;
    map.setPaintProperty(clusterList.name, "fill-color", [
      "case",
      ["==", ["get", "cluster" + clusterId], 0],
      list[0].checked ? utils.rgbaToString(list[0].color!) : transparent,
      ["==", ["get", "cluster" + clusterId], 1],
      list[1].checked ? utils.rgbaToString(list[1].color!) : transparent,
      ["==", ["get", "cluster" + clusterId], 2],
      list[2].checked ? utils.rgbaToString(list[2].color!) : transparent,
      ["==", ["get", "cluster" + clusterId], 3],
      list[3].checked ? utils.rgbaToString(list[3].color!) : transparent,
      transparent,
    ]);
  }
}

/**
 * Add a report layer to the mapbox map.
 * @param kMeansLayers kMeans Layers to be used to create the report layer.
 * @param map Map to which the layer is added.
 */
export function addReportLayer(
  title: string,
  geoJson: HealthcareFeatureCollection,
  clusterCombinations: Report[],
  map: mapboxgl.Map
) {
  // Remove the layer if it already exists.
  map.getSource(title) && map.removeSource(title);
  map.getLayer(title) && map.removeLayer(title);

  // Add source and layer to the map.
  map.addSource(title, {
    type: "geojson",
    data: geoJson,
  });
  const fillColorExpression: mapboxgljs.DataDrivenPropertyValueSpecification<string> =
    ["case"];
  clusterCombinations.forEach((combination) => {
    fillColorExpression.push(
      ["==", ["get", "clusterCombination"], combination.index],
      utils.rgbaToString(combination.color)
    );
  });
  fillColorExpression.push(transparent);

  map.addLayer(
    {
      id: title,
      type: "fill",
      source: title,
      paint: {
        "fill-color": fillColorExpression,
        "fill-opacity": 1,
        "fill-outline-color": "rgba(217, 217, 217, 0.36)",
      },
    },
    "road-simple"
  );
}

/**
 * Add a k-means cluster layer to the mapbox map.
 * @param clusterId clustering iteration number.
 * @param kMeansLayer kMeans Layer to be added.
 * @param map Map to which the layer is added.
 * @param useColor If true, the layer is colored.
 */
export function addClusterLayer(
  clusterId: string,
  kMeansLayer: KMeansLayer,
  map: mapboxgl.Map,
  useColor?: boolean
) {
  // Remove the layer if it already exists.
  map.getSource(kMeansLayer.title) && map.removeSource(kMeansLayer.title);
  map.getLayer(kMeansLayer.title) && map.removeLayer(kMeansLayer.title);

  // Add source and layer to the map.
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
          ["==", ["get", "cluster" + clusterId], 0],
          useColor ? utils.rgbaToString(kMeansLayer.colors[0]) : transparent,
          ["==", ["get", "cluster" + clusterId], 1],
          useColor ? utils.rgbaToString(kMeansLayer.colors[1]) : transparent,
          ["==", ["get", "cluster" + clusterId], 2],
          useColor ? utils.rgbaToString(kMeansLayer.colors[2]) : transparent,
          ["==", ["get", "cluster" + clusterId], 3],
          useColor ? utils.rgbaToString(kMeansLayer.colors[3]) : transparent,
          transparent,
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
 * @param kMeansLayer Layer to be removed.
 * @param map Map from which the layer is removed.
 */
export function removeClusterLayer(
  kMeansLayer: KMeansLayer,
  map: mapboxgl.Map
) {
  if (map.getLayer(kMeansLayer.title)) {
    map.removeLayer(kMeansLayer.title);
  }
}
/**
 * Remove all k-means cluster layers from the mapbox map.
 * @param kMeansLayers Layers to be removed.
 * @param map Map from which the layers are removed.
 */
export function removeAllClusterLayers(
  kMeansLayers: KMeansLayer[],
  map: mapboxgl.Map
) {
  kMeansLayers.forEach((kMeansLayer) => {
    removeClusterLayer(kMeansLayer, map);
  });
}

/**
 * Turn off all layers by setting opacity to 0.
 * @param map Map in which the layers are turned off.
 */
export function offLayers(map: mapboxgl.Map) {
  sectionMapConfigs.forEach((sec) => {
    sec.layers.forEach((layer) => {
      setLayerOpacity({ name: layer.name, opacity: 0 }, map);
    });
  });
}

/**
 * Set the line weight of the selected feature.
 * @param layer Name of the layer.
 * @param key Name of the layer property id.
 * @param value Value of layer property id to compare.
 * @param lineWeight Line weight of the outline.
 */
export function setLineWidth(
  layer: string,
  key: string,
  value: number,
  lineWeight: number,
  map: mapboxgl.Map
) {
  map.setPaintProperty(layer, "line-width", [
    "case",
    ["==", ["get", key], value],
    lineWeight,
    0,
  ]);
}

/**
 * Hide the line width of the mapbox layer.
 * @param layer Name of the layer to hide.
 */
export function hideLineWidth(layer: string, map: mapboxgl.Map) {
  map.setPaintProperty(layer, "line-width", 0);
}

/**
 * Add mapbox map controls.
 * @param container Container to which the controls are located.
 */
export function addControls(
  container: HTMLElement,
  map: mapboxgl.Map
): HTMLElement[] {
  if (!container || !map) return [];

  const geolocationControl = new mapboxgl.GeolocateControl();
  const navigationControl = new mapboxgl.NavigationControl({
    showCompass: false,
  });
  const controls: mapboxgl.IControl[] = [geolocationControl, navigationControl];
  const controlElements: HTMLElement[] = [];

  controls.forEach((control) => {
    const controlElement = control.onAdd(map);
    container.appendChild(controlElement);
    controlElements.push(controlElement);
  });

  return controlElements;
}

/**
 * Add a location search button to the mapbox map.
 * @param container Container to which the search button is located.
 * @returns Search button element.
 */
export function addSearchButton(
  container: HTMLElement,
  map: mapboxgl.Map
): HTMLElement {
  const geocoder = new MapboxGeocoder({
    accessToken: import.meta.env.VITE_API_KEY_MAPBOX as string,
    mapboxgl: mapboxgljs,
    marker: true,
    placeholder: "Search location",
    collapsed: true,
    bbox: mapConfigs.bbox,
  });

  const searchButton = geocoder.onAdd(map);
  container.appendChild(searchButton);

  return searchButton;
}

/**
 * Relocate the mapbox logo element to the input container.
 * @param container Container to which the logo is relocated.
 */
export function relocateLogo(container: HTMLElement) {
  const logo = document.querySelector(
    `.mapboxgl-ctrl-logo`
  ) as HTMLElement | null;
  if (logo == null) return;

  container.appendChild(logo);
}
