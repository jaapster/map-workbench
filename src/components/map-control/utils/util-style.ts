import {
	POINT,
	CIRCLE,
	VERTEX,
	SEGMENT,
	POLYGON,
	RECTANGLE,
	MULTI_POINT,
	MULTI_POLYGON, EMPTY
} from '../../../constants';

// predicates
export const isPoint = ['==', 'type', POINT];
export const isCircle = ['==', 'type', CIRCLE];
export const isVertex = ['==', 'type', VERTEX];
export const isSegment = ['==', 'type', SEGMENT];
export const isPolygon = ['==', 'type', POLYGON];
export const isRectangle = ['==', 'type', RECTANGLE];
export const isMultiPoint = ['==', 'type', MULTI_POINT];
export const isMultiPolygon = ['==', 'type', MULTI_POLYGON];
export const isVertexSelected = ['==', 'type', 'selected-vertex'];

export const isPointLike = ['any', isPoint, isMultiPoint];
export const isSegmentLike = ['any', isSegment, isCircle];
export const isPolygonLike = ['any', isCircle, isPolygon, isRectangle, isMultiPolygon];

const transparent = 'rgba(0, 0, 0, 0)';

export const getStyle = (colorRegular: string, colorSelected: string) => {
	const name = `${ Math.round(Math.random() * 10000000000000000) }s`;

	const sources = {
		[name]: {
			type: 'geojson',
			data: EMPTY
		},

		[`${ name }Selected`]: {
			type: 'geojson',
			data: EMPTY
		}
	};

	const layers = [
		{
			id: `${ name }-point`,
			type: 'circle',
			source: name,
			filter: isPointLike,
			paint: {
				'circle-color': colorRegular,
				'circle-radius': 4
			}
		},
		{
			id: `${ name }-line`,
			type: 'line',
			source: name,
			paint: {
				'line-width': 1,
				'line-color': colorRegular
			}
		},
		{
			id: `${ name }-fill`,
			type: 'fill',
			source: name,
			filter: isPolygonLike,
			paint: {
				'fill-color': colorRegular,
				'fill-opacity': 0.05
			}
		},
		{
			id: `${ name }-point-selected`,
			type: 'circle',
			source: `${ name }Selected`,
			filter: isPointLike,
			paint: {
				'circle-color': colorSelected,
				'circle-radius': 4
			}
		},
		{
			id: `${ name }-segment-selected`,
			type: 'line',
			source: `${ name }Selected`,
			filter: isSegmentLike,
			paint: {
				'line-width': 1,
				'line-color': colorSelected,
				'line-dasharray': [1, 1]
			}
		},
		{
			id: `${ name }-segment-selected-label`,
			type: 'symbol',
			source: `${ name }Selected`,
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
			id: `${ name }-fill-selected`,
			type: 'fill',
			source: `${ name }Selected`,
			filter: isPolygonLike,
			paint: {
				'fill-color': colorSelected,
				'fill-opacity': 0.05
			}
		},
		{
			id: `${ name }-vertex`,
			type: 'circle',
			source: `${ name }Selected`,
			filter: isVertex,
			paint: {
				'circle-color': colorSelected,
				'circle-radius': 2.5
			}
		},
		{
			id: `${ name }-vertex-selected`,
			type: 'circle',
			source: `${ name }Selected`,
			filter: isVertexSelected,
			paint: {
				'circle-color': transparent,
				'circle-radius': 6,
				'circle-stroke-width': 1,
				'circle-stroke-color': colorSelected
			}
		}
	];

	return {
		sources,
		layers,
		source: name
	};
};
