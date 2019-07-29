export interface Ev {
	merc: Point;
	point: Point;
	lngLat: LngLat;
	movement: Point;
	originalEvent: any;
}

export type Dict<T> = { [key: string]: T };

export type EPSG = 4326 | 3857;

export interface Location {
	zoom: number;
	title?: string;
	center: Co;
	epsg: EPSG;
}

export interface Point {
	x: number;
	y: number;
}

export interface LngLat {
	lng: number;
	lat: number;
}

export type Co = [number, number];

export type Cos = Co | Co[] | Co[][] | Co[][][];

export interface GeometryData {
	type: string;
	coordinates: Cos;
}

export interface GeometryCollectionJSON {
	type: 'GeometryCollection';
	geometries: GeometryData[];
}

export interface LineStringJSON extends GeometryData {
	type: 'LineString';
	coordinates: Co[];
}

export interface MultiPointJSON extends GeometryData {
	type: 'MultiPoint';
	coordinates: Co[];
}

export interface PolygonJSON extends GeometryData {
	type: 'Polygon';
	coordinates: Co[][];
}

export interface MultiPolygonJSON extends GeometryData {
	type: 'MultiPolygon';
	coordinates: Co[][][];
}

export interface FeatureData<GeometryJSON> {
	type: string;
	geometry: GeometryJSON;
	properties: {
		type: string,
		id: string,
		text?: string
	};
}

export interface FeatureCollectionData {
	type: string;
	features: FeatureData[];
}

export type Bounds = [Co, Co];

export interface MapboxLayer {
	id: string;
	type: string;
	source: string;
}

export interface MapboxSource {
	type: string;
	tiles: string[];
}

export interface MapboxStyle {
	sources: Dict<MapboxSource>;
	layers: MapboxLayer[];
}

type SelectionVector = number[];

interface CollectionData {
	featureCollection: FeatureCollectionData;
	selection: SelectionVector[];
}

interface LayerData {
	id: string;
	style: MapboxStyle;
}

interface MapData {
	id: string;
	layers: LayerData[];
	opacity: number;
	visible: boolean;
}

interface WorldData {
	id: string;
	maps: MapData[];
	collections: Dict<CollectionData>;
	currentMapId: string;
	currentCollectionId: string;
	universeIndex: number;
}

interface UniverseData {
	crs: EPSG;
	maps: MapData[];
	worlds: WorldData[];
}

export interface MultiverseData {
	worlds: Dict<WorldData>;
	universes: UniverseData[];
	currentWorldId: string;
}
