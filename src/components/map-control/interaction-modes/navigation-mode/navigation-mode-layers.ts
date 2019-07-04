// predicates
const isLine = ['==', '$type', 'LineString'];
const isPoint = ['==', '$type', 'Point'];
const isPolygon = ['==', '$type', 'Polygon'];

const colorRegular = 'deeppink';

export const layers = [
	{
		id: 'selection-point',
		type: 'circle',
		source: 'selection',
		filter: isPoint,
		paint: {
			'circle-radius': 4,
			'circle-color': colorRegular
		}
	},
	{
		id: 'selection-line',
		type: 'line',
		source: 'selection',
		filter: isLine,
		paint: {
			'line-width': 5,
			'line-color': colorRegular
		}
	},
	{
		id: 'selection-polygon-line',
		type: 'line',
		source: 'selection',
		filter: isPolygon,
		paint: {
			'line-width': 1,
			'line-color': colorRegular
		}
	},
	{
		id: 'selection-polygon-fill',
		type: 'fill',
		source: 'selection',
		filter: isPolygon,
		paint: {
			'fill-color': colorRegular,
			'fill-opacity': 0.2
		}
	}
];