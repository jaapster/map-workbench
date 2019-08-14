import { Location } from '../types';

export const PRECISION = 1;
export const THRESHOLD = 7;

export const POINT = 'Point';
export const CIRCLE = 'Circle';
export const FEATURE = 'Feature';
export const POLYGON = 'Polygon';
export const SEGMENT = 'Segment';
export const RECTANGLE = 'Rectangle';
export const MULTI_POINT = 'MultiPoint';
export const LINE_STRING = 'LineString';
export const MULTI_POLYGON = 'MultiPolygon';
export const MULTI_LINE_STRING = 'MultiLineString';

export const MODIFIERS = {
	ROTATE: 'altKey',
	MIRROR: 'ctrlKey',
	ADD_VERTEX: 'altKey',
	CONSERVE_RATIO: 'shiftKey'
};

export const GEOGRAPHIC = 4326;

export const PROJECTED = 3857;

export const DEFAULT_LOCATION: Location = {
	center: [0, 0],
	zoom: 1,
	epsg: GEOGRAPHIC
};

export const MENU_MODE = 'menu';
export const UPDATE_MODE = 'update';
export const NAVIGATION_MODE = 'navigate';
export const DRAW_POINT_MODE = 'drawPoint';
export const DRAW_CIRCLE_MODE = 'drawCircle';
export const DRAW_RECTANGLE_MODE = 'drawRectangle';
export const DRAW_SEGMENTED_MODE = 'drawSegmented';

export const EMPTY_STYLE = { version: 8, sources: {}, layers: [] };

export const SCALE_BASE_WIDTH = 300;

export const METRIC = 'metric';
export const IMPERIAL = 'imperial';

export const M = 'm';
export const M2 = 'm2';
