// predicates
const isSelected = ['==', ['get', 'selected'], true];
const isVertex = ['==', ['get', 'type'], 'vertex'];
const isPolygon = ['==', '$type', 'Polygon'];

// colors
const colorSelected = 'orange';
const colorRegular = 'red';
const color = ['case', isSelected, colorSelected, colorRegular];

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
	{
		id: 'draw-line',
		type: 'line',
		source: 'draw',
		paint: {
			'line-color': color
		}
	},
	{
		id: 'draw-vertex',
		type: 'circle',
		source: 'draw',
		paint: {
			'circle-color': color,
			'circle-radius': 3
		}
	},
	{
		id: 'draw-vertex-selected',
		type: 'circle',
		source: 'draw',
		filter: isVertex,
		paint: {
			'circle-color': colorSelected,
			'circle-radius': 5
		}
	}
];
