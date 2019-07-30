import { Location } from './types';

export const PRECISION = 1;
export const THRESHOLD = 7;

export const POINT = 'Point';
// export const VERTEX = 'Vertex';
export const CIRCLE = 'Circle';
export const FEATURE = 'Feature';
export const POLYGON = 'Polygon';
export const SEGMENT = 'Segment';
export const RECTANGLE = 'Rectangle';
export const MULTI_POINT = 'MultiPoint';
export const LINE_STRING = 'LineString';
export const MULTI_POLYGON = 'MultiPolygon';
export const MULTI_LINE_STRING = 'MultiLineString';
export const FEATURE_COLLECTION = 'FeatureCollection';

export const MODIFIERS = {
	ROTATE: 'altKey',
	MIRROR: 'ctrlKey',
	ADD_VERTEX: 'altKey',
	CONSERVE_RATIO: 'shiftKey'
};

export const GEOGRAPHIC = 4326;

export const PROJECTED = 3857;

export const LOCATIONS: Location[] = [
	{
		title: 'Astoria',
		center: [-123.8380, 46.1937],
		zoom: 15,
		epsg: GEOGRAPHIC
	},
	{
		title: 'Crater Lake',
		center: [-122.114, 42.937],
		zoom: 13,
		epsg: GEOGRAPHIC
	},
	{
		title: 'Lake Quinault',
		center: [-123.848, 47.468],
		zoom: 16,
		epsg: GEOGRAPHIC
	}
];

export const DEFAULT_LOCATION: Location = {
	center: [0, 0],
	zoom: 1,
	epsg: GEOGRAPHIC
};

export const MENU_MODE = 'menu';
export const DRAW_MODE = 'draw';
export const UPDATE_MODE = 'update';
export const NAVIGATION_MODE = 'navigate';

export const EMPTY_STYLE = { version: 8, sources: {}, layers: [] };

export const EMPTY_FEATURE_COLLECTION = {
	type: FEATURE_COLLECTION,
	features: []
};
