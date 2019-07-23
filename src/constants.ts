export const ID_MAP_CONTROL = '__map-control__';
export const ID_MAP_CONTROL_TOOLS = '__map-control-tools__';
export const ID_MAP_CONTROL_LAYER_PANELS = '__map-control-layers__';
export const ID_MAP_CONTROL_SVG = '__map-control-svg__';

export const PRECISION = 1;
export const THRESHOLD = 7;

export const POINT = 'Point';
export const VERTEX = 'Vertex';
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

export const EMPTY_COLLECTION = {
	type: FEATURE_COLLECTION,
	features: []
};

export const EMPTY_SOURCE: any = {
	type: 'geojson',
	data: EMPTY_COLLECTION
};

export const EMPTY_STYLE = {
	version: 8,
	name: '',
	glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
	sprite: 'mapbox://sprites/mapbox/dark-v10',
	sources: {},
	layers: []
};

export const LOCATIONS = [
	{
		title: 'Astoria',
		center: [-123.8380, 46.1937],
		zoom: 14
	},
	{
		title: 'Crater Lake',
		center: [-122.114, 42.937],
		zoom: 12
	},
	{
		title: 'Lake Quinault',
		center: [-123.848, 47.468],
		zoom: 15
	}
];

export const MENU_MODE = 'menu';
export const DRAW_MODE = 'draw';
export const UPDATE_MODE = 'update';
export const NAVIGATION_MODE = 'navigation';
