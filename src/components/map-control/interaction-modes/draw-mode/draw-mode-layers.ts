// predicates
const isSelected = ['==', ['get', 'selected'], true];
const isRegular = ['!=', ['get', 'selected'], true];
const isPolygon = ['==', '$type', 'Polygon'];
const isVertex = ['==', ['get', 'type'], 'vertex'];

// colors
const colorSelected = 'orangered';
const colorRegular = 'grey';
const color = ['case', isSelected, colorSelected, colorRegular];

// line styles
const lineStyleRegular = [1, 0];
const lineStyleSelected = [2, 1];

export const layers = [
	{
		id: 'draw-fill',
		type: 'fill',
		source: 'draw',
		filter: isPolygon,
		paint: {
			'fill-color': color,
			'fill-opacity': 0.2
		}
	},
	// todo: when mapbox supports data driven dash dasharray
	// replace the following two layers with one
	{
		id: 'draw-line-regular',
		type: 'line',
		source: 'draw',
		filter: isRegular,
		paint: {
			'line-width': 1,
			'line-color': colorRegular,
			'line-dasharray': lineStyleRegular
		}
	},
	{
		id: 'draw-line-selected',
		type: 'line',
		source: 'draw',
		filter: isSelected,
		paint: {
			'line-width': 2,
			'line-color': colorSelected,
			'line-dasharray': lineStyleSelected
		}
	},
	{
		id: 'draw-vertex',
		type: 'circle',
		source: 'draw',
		filter: isSelected,
		paint: {
			'circle-color': colorSelected,
			'circle-radius': 4
		}
	},
	{
		id: 'draw-vertex-selected',
		type: 'circle',
		source: 'draw',
		filter: isVertex,
		paint: {
			'circle-color': colorSelected,
			'circle-radius': 6
		}
	}
];
