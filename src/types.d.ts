export type Dict<T> = { [key: string]: T };

export type Co = number[];

export type Cos = Co | Co[] | Co[][] | Co[][][];

export type GeometryType = 'Point' | 'LineString' | 'Polygon' | 'MultiLineString' | 'MultiPolygon';

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

export interface Feature {
	type: string;
	geometry: Geometry;
	properties?: Dict<any>;
}

export interface FeatureCollection {
	type: string;
	features: Feature[];
}
