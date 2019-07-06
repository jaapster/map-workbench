export const ID_MAP_CONTROL = '__map-control__';
export const ID_MAP_CONTROL_TOOLS = '__map-control-tools__';
export const ASTORIA = [-123.8340, 46.1937];

export const POINT = 'Point';
export const CIRCLE = 'Circle';
export const FEATURE = 'Feature';
export const POLYGON = 'Polygon';
export const SEGMENT = 'Segment';
export const RECTANGLE = 'Rectangle';
export const PRECISION = 1;
export const THRESHOLD = 7;
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

export const EMPTY = {
	type: FEATURE_COLLECTION,
	features: []
};
