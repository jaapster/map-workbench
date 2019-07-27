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

export interface GeometryJSON {
	type: string;
	coordinates: Cos;
}

export interface GeometryCollectionJSON {
	type: 'GeometryCollection';
	geometries: GeometryJSON[];
}

export interface LineStringJSON extends GeometryJSON {
	type: 'LineString';
	coordinates: Co[];
}

export interface MultiPointJSON extends GeometryJSON {
	type: 'MultiPoint';
	coordinates: Co[];
}

export interface PolygonJSON extends GeometryJSON {
	type: 'Polygon';
	coordinates: Co[][];
}

export interface MultiPolygonJSON extends GeometryJSON {
	type: 'MultiPolygon';
	coordinates: Co[][][];
}

export interface FeatureJSON<GeometryJSON> {
	type: string;
	geometry: GeometryJSON;
	properties: {
		type: string,
		id: string,
		text?: string
	};
}

export interface FeatureCollectionJSON {
	type: string;
	features: FeatureJSON[];
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
