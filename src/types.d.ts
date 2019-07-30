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
	epsg: EPSG;
	zoom: number;
	title?: string;
	center: Co;
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
	layers: MapboxLayer[];
	sources: Dict<MapboxSource>;
}

type SelectionVector = number[];

interface CollectionData {
	selection: SelectionVector[];
	featureCollection: FeatureCollectionData;
}

interface LayerData {
	id: string;
	style: MapboxStyle;
	opacity: number;
	visible: boolean;
}

interface MapData {
	id: string;
	layers: LayerData[];
	opacity: number;
	visible: boolean;
}

interface WorldData {
	id: string;
	maps: Dict<MapData>;
	collections: Dict<CollectionData>;
	currentMapId: string;
	universeIndex: number;
	currentCollectionId: string;
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

export type MapControlMode = 'navigate' | 'update' | 'draw' | 'menu';

export interface MapControlData {
	CRS: EPSG;
	mode: MapControlMode;
}
