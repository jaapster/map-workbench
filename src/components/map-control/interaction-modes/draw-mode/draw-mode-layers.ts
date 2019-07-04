// predicates
const isPoint = ['==', 'type', 'Point'];
const isPolygon = ['==', '$type', 'Polygon'];
const isVertex = ['==', 'type', 'vertex'];
const isVertexSelected = ['==', 'type', 'selected-vertex'];

// colors
const transparent = 'rgba(0, 0, 0, 0)';
const colorSelected = 'orangered';
const colorRegular = 'grey';

export const layers = [
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
		filter: isPolygon,
		paint: {
			'fill-color': colorRegular,
			'fill-opacity': 0.2
		}
	},
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
		id: 'draw-line-selected',
		type: 'line',
		source: 'draw-selected',
		paint: {
			'line-width': 1,
			'line-color': colorSelected,
			'line-dasharray': [3, 3]
		}
	},
	{
		id: 'draw-fill-selected',
		type: 'fill',
		source: 'draw-selected',
		filter: isPolygon,
		paint: {
			'fill-color': colorSelected,
			'fill-opacity': 0.2
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