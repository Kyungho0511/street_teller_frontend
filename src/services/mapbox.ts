import {
  Color,
  mapConfigs,
  MapBound,
  MapLayer,
  transparent,
  ZOOM_MODIFIER,
  themeColor,
} from "../constants/mapConstants";
import { sectionMapConfigs } from "../constants/sectionConstants";
import { ClusterList } from "../constants/surveyConstants";
import { Section } from "../constants/sectionConstants";
import * as utils from "../utils/utils";
import {
  HealthcareFeatureCollection,
  HealthcarePropertyName,
} from "../constants/geoJsonConstants";
import { MapMode } from "../context/MapContext";
import mapboxgl from "mapbox-gl";
import * as mapboxgljs from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import mapboxgl from "mapbox-gl";
import mapboxgl from "mapbox-gl";
import mapboxgl from "mapbox-gl";
import { AnyLayer } from "mapbox-gl";
import mapboxgl from "mapbox-gl";

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
      map.getLayer(layer.name) &&
        map.setPaintProperty(layer.name, prop, layer.opacity);
    });
}

/**
 * Set layer settings based on the section.
 * @param section Each url path corresponds to a section.
 * @param map Map in which layers are set.
 */
export function setLayerSettings(section: Section, map: mapboxgl.Map): void {
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
  if (!map || !map.getLayer(clusterList.name)) return;

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

/**
 * Add a report layer to the mapbox map.
 * @param name Name of the report layer.
 * @param geoJson GeoJson data to be added to the map.
 * @param reports List of reports to be added to the map.
 * @param map Map to which the layer is added.
 */
export function addReportLayer(
  name: string,
  geoJson: HealthcareFeatureCollection,
  map: mapboxgl.Map
) {
  // Remove the layer if it already exists.
  map.getSource(name) && map.removeSource(name);
  map.getLayer(name) && map.removeLayer(name);

  // Add source and layer to the map.
  map.addSource(name, {
    type: "geojson",
    data: geoJson,
  });

  // // color expression for belended colors
  // const fillColorExpression: mapboxgljs.DataDrivenPropertyValueSpecification<string> =
  //   ["case"];
  // reports.forEach((report) => {
  //   fillColorExpression.push(
  //     ["==", ["get", "report"], report.index],
  //     utils.rgbaToString(report.color)
  //   );
  // });
  // fillColorExpression.push(transparent);

  map.addLayer(
    {
      id: name,
      type: "fill",
      source: name,
      paint: {
        "fill-color": utils.rgbaToString(themeColor),
        "fill-opacity": 1,
        "fill-outline-color": "rgba(217, 217, 217, 0.36)",
      },
    },
    "road-simple"
  );
}

/**
 * Add a k-means cluster layer to the mapbox map.
 * @param geoJson GeoJson data to be added to the map.
 * @param clusterList List of clusters to be added to the map.
 * @param map Map to which the layer is added.
 */
export function addClusterLayer(
  geoJson: HealthcareFeatureCollection,
  clusterList: ClusterList,
  map: mapboxgl.Map
): {
  layer: mapboxgl.LayerSpecification | mapboxgl.CustomLayerInterface;
  source: mapboxgl.SourceSpecification;
} {
  // Remove the layer if it already exists.
  map.getSource(clusterList.name) && map.removeSource(clusterList.name);
  map.getLayer(clusterList.name) && map.removeLayer(clusterList.name);

  // Add source and layer to the map.
  const source: mapboxgljs.SourceSpecification = {
    type: "geojson",
    data: geoJson,
  };
  map.addSource(clusterList.name, source);

  map.addLayer(
    {
      id: clusterList.name,
      type: "fill",
      source: clusterList.name,
      paint: {
        "fill-color": [
          "case",
          ["==", ["get", clusterList.name], 0],
          utils.rgbaToString(clusterList.list[0].color),
          ["==", ["get", clusterList.name], 1],
          utils.rgbaToString(clusterList.list[1].color),
          ["==", ["get", clusterList.name], 2],
          utils.rgbaToString(clusterList.list[2].color),
          ["==", ["get", clusterList.name], 3],
          utils.rgbaToString(clusterList.list[3].color),
          transparent,
        ],
        "fill-opacity": 1,
        "fill-outline-color": "rgba(217, 217, 217, 0.36)",
      },
    },
    "road-simple"
  );

  return {
    layer: map.getLayer(clusterList.name)!,
    source,
  };
}

/**
 * Remove a k-means cluster layer from the mapbox map.
 * @param clusterList List of clusters to be removed.
 * @param map Map from which the layer is removed.
 */
export function removeClusterLayer(
  clusterList: ClusterList,
  map: mapboxgl.Map
) {
  if (map.getLayer(clusterList.name)) {
    map.removeLayer(clusterList.name);
  }
}
/**
 * Remove all k-means cluster layers from the mapbox map.
 * @param clusterListCollection Collection of cluster lists to be removed.
 * @param map Map from which the layers are removed.
 */
export function removeAllClusterLayers(
  clusterListCollection: ClusterList[],
  map: mapboxgl.Map
) {
  clusterListCollection.forEach((list) => {
    removeClusterLayer(list, map);
  });
}

export function restoreLayer(
  layer: mapboxgljs.LayerSpecification | mapboxgljs.CustomLayerInterface,
  source: mapboxgl.SourceSpecification,
  map: mapboxgl.Map
) {
  console.log("restoreLayer", layer, source);

  map.getSource(layer.id) && map.removeSource(layer.id);
  map.addSource(layer.id, source);

  map.getLayer(layer.id) && map.removeLayer(layer.id);
  map.addLayer(layer, "road-simple");
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
