export interface Ev {
	merc: Point;
	point: Point;
	lngLat: LngLat;
	movement: Point;
	originalEvent: any;
}

export type Dict<T> = { [key: string]: T };

export interface Location {
	zoom: number;
	title?: string;
	center: any;
}

export interface Point {
	x: number;
	y: number;
}

export interface LngLat {
	lng: number;
	lat: number;
}

export type Co = number[];

export type Cos = Co | Co[] | Co[][] | Co[][][];

export interface Geometry {
	type: string;
	coordinates: Cos;
}

export interface GeometryCollection {
	type: 'GeometryCollection';
	geometries: Geometry[];
}

export interface LineString extends Geometry {
	type: 'LineString';
	coordinates: Co[];
}

export interface MultiPoint extends Geometry {
	type: 'MultiPoint';
	coordinates: Co[];
}

export interface Polygon extends Geometry {
	type: 'Polygon';
	coordinates: Co[][];
}

export interface MultiPolygon extends Geometry {
	type: 'MultiPolygon';
	coordinates: Co[][][];
}

export interface Feature<T> {
	type: string;
	geometry: T;
	properties: {
		type: string,
		id: string,
		text?: string
	};
}

export interface FeatureCollection {
	type: string;
	features: Feature[];
}

export type Bounds = [Co, Co];
