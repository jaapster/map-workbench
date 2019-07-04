export type Dict<T> = { [key: string]: T };

export type Co = number[];

export type Cos = Co | Co[] | Co[][] | Co[][][];

export interface Point {
	x: number;
	y: number;
}

export interface LngLat {
	lng: number;
	lat: number;
}

export interface Geometry {
	type: string;
	coordinates: Cos;
}

export interface Feature<T> {
	type: string;
	geometry: T;
	properties?: Dict<any>;
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

export interface FeatureCollection {
	type: string;
	features: Feature[];
}

export type ProjectFn = (c: LngLat) => Point;
export type UnprojectFn = (p: Point) => LngLat;