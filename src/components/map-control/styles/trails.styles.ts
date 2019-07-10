import {
	EMPTY,
	POINT,
	CIRCLE,
	VERTEX,
	SEGMENT,
	POLYGON,
	RECTANGLE,
	MULTI_POINT,
	MULTI_POLYGON
} from '../../../constants';

// predicates
const isPoint = ['==', 'type', POINT];
const isCircle = ['==', 'type', CIRCLE];
const isVertex = ['==', 'type', VERTEX];
const isSegment = ['==', 'type', SEGMENT];
const isPolygon = ['==', 'type', POLYGON];
const isRectangle = ['==', 'type', RECTANGLE];
const isMultiPoint = ['==', 'type', MULTI_POINT];
const isMultiPolygon = ['==', 'type', MULTI_POLYGON];
const isVertexSelected = ['==', 'type', 'selected-vertex'];

const isPointLike = ['any', isPoint, isMultiPoint];
const isSegmentLike = ['any', isSegment, isCircle];
const isPolygonLike = ['any', isCircle, isPolygon, isRectangle, isMultiPolygon];

// colors
const transparent = 'rgba(0, 0, 0, 0)';
const colorRegular = 'deeppink';
const colorSelected = 'lime'; // 'mediumspringgreen';

const sources = {
	draw: {
		type: 'geojson',
		data: EMPTY
	},

	drawSelected: {
		type: 'geojson',
		data: EMPTY
	}
};

const regular = [
	{
		id: 'draw-point',
		type: 'circle',
		source: 'draw',
		filter: isPointLike,
		paint: {
			'circle-color': colorRegular,
			'circle-radius': 4
		}
	},
	{
		id: 'draw-line',
		type: 'line',
		source: 'draw',
		paint: {
			'line-width': 1,
			'line-color': colorRegular
		}
	},
	{
		id: 'draw-fill',
		type: 'fill',
		source: 'draw',
		filter: isPolygonLike,
		paint: {
			'fill-color': colorRegular,
			'fill-opacity': 0.05
		}
	}
];

const selected = [
	{
		id: 'draw-point-selected',
		type: 'circle',
		source: 'drawSelected',
		filter: isPointLike,
		paint: {
			'circle-color': colorSelected,
			'circle-radius': 4
		}
	},
	{
		id: 'draw-segment-selected',
		type: 'line',
		source: 'drawSelected',
		filter: isSegmentLike,
		paint: {
			'line-width': 1,
			'line-color': colorSelected,
			'line-dasharray': [1, 1] // [4, 2]
		}
	},
	{
		id: 'draw-segment-selected-label',
		type: 'symbol',
		source: 'drawSelected',
		filter: isSegmentLike,
		paint: {
			'text-color': colorSelected
		},
		layout: {
			'text-size': 10,
			'text-field': ['get', 'text'],
			'text-offset': [0, -1],
			'symbol-placement': 'line-center',
			'symbol-avoid-edges': false,
			'text-allow-overlap': true
		}
	},
	{
		id: 'draw-fill-selected',
		type: 'fill',
		source: 'drawSelected',
		filter: isPolygonLike,
		paint: {
			'fill-color': colorSelected,
			'fill-opacity': 0.05
		}
	},
	{
		id: 'draw-vertex',
		type: 'circle',
		source: 'drawSelected',
		filter: isVertex,
		paint: {
			'circle-color': colorSelected,
			'circle-radius': 2.5
		}
	},
	{
		id: 'draw-vertex-selected',
		type: 'circle',
		source: 'drawSelected',
		filter: isVertexSelected,
		paint: {
			'circle-color': transparent,
			'circle-radius': 6,
			'circle-stroke-width': 1,
			'circle-stroke-color': colorSelected
		}
	} // ,
	// {
	// 	id: 'draw-center-selected',
	// 	type: 'symbol',
	// 	source: 'drawSelected',
	// 	filter: ['==', 'type', 'Center'],
	// 	paint: {
	// 		'text-color': colorSelected
	// 	},
	// 	layout: {
	// 		'text-size': 10,
	// 		'text-field': ['get', 'text'],
	// 		'text-offset': [0, -1.1],
	// 		'symbol-avoid-edges': false,
	// 		'text-allow-overlap': true
	// 	}
	// }
];

export const trailsStyles = [
	...regular,
	...selected
];

export const trailStyle = {
	sources,
	layers: [
		...regular,
		...selected
	],
	source: 'draw'
};
