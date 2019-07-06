import {
	CIRCLE,
	POINT,
	SEGMENT,
	POLYGON,
	RECTANGLE,
	MULTI_POLYGON } from '../../../../services/constants';

// predicates
const isPoint = ['==', 'type', POINT];
const isCircle = ['==', 'type', CIRCLE];
const isVertex = ['==', 'type', 'vertex'];
const isSegment = ['==', 'type', SEGMENT];
const isPolygon = ['==', 'type', POLYGON];
const isRectangle = ['==', 'type', RECTANGLE];
const isMultiPolygon = ['==', 'type', MULTI_POLYGON];
const isVertexSelected = ['==', 'type', 'selected-vertex'];

const isSegmentLike = ['any', isSegment, isCircle];
const isPolygonLike = ['any', isCircle, isPolygon, isRectangle, isMultiPolygon];

// colors
const transparent = 'rgba(0, 0, 0, 0)';
const colorRegular = 'grey';
const colorSelected = 'ivory';

const regular = [
	{
		id: 'draw-point',
		type: 'circle',
		source: 'draw',
		filter: isPoint,
		paint: {
			'circle-radius': 4,
			'circle-color': colorRegular
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
		source: 'draw-selected',
		filter: isPoint,
		paint: {
			'circle-radius': 4,
			'circle-color': colorRegular
		}
	},
	{
		id: 'draw-segment-selected',
		type: 'line',
		source: 'draw-selected',
		filter: isSegmentLike,
		paint: {
			'line-width': 1,
			'line-color': colorSelected,
			'line-dasharray': [3, 2]
		}
	},
	{
		id: 'draw-segment-selected-label',
		type: 'symbol',
		source: 'draw-selected',
		filter: isSegmentLike,
		paint: {
			'text-color': colorSelected
		},
		layout: {
			'symbol-placement': 'line-center',
			'symbol-avoid-edges': false,
			'text-field': ['get', 'text'],
			'text-offset': [0, 1],
			'text-allow-overlap': true,
			'text-size': 10
		}
	},
	{
		id: 'draw-fill-selected',
		type: 'fill',
		source: 'draw-selected',
		filter: isPolygonLike,
		paint: {
			'fill-color': colorSelected,
			'fill-opacity': 0.05
		}
	},
	{
		id: 'draw-vertex',
		type: 'circle',
		source: 'draw-selected',
		filter: isVertex,
		paint: {
			'circle-color': colorSelected,
			'circle-radius': 4
		}
	},
	{
		id: 'draw-vertex-selected',
		type: 'circle',
		source: 'draw-selected',
		filter: isVertexSelected,
		paint: {
			'circle-radius': 6,
			'circle-color': transparent,
			'circle-stroke-width': 1,
			'circle-stroke-color': colorSelected
		}
	}
];

export const layers = [
	...regular,
	...selected
];
