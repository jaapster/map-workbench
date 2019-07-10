// predicates
import { EMPTY } from '../../../constants';

const isLine = ['==', 'type', 'LineString'];
const isPoint = ['==', 'type', 'Point'];
const isPolygon = ['==', 'type', 'Polygon'];

const colorRegular = 'dodgerblue';

const sources = {
	selection: {
		type: 'geojson',
		data: EMPTY
	}
};

export const layers = [
	{
		id: 'selection-point',
		type: 'circle',
		source: 'selectionSelected',
		filter: isPoint,
		paint: {
			'circle-radius': 4,
			'circle-color': colorRegular
		}
	},
	{
		id: 'selection-line',
		type: 'line',
		source: 'selectionSelected',
		filter: isLine,
		paint: {
			'line-width': 1,
			'line-color': colorRegular
		}
	},
	{
		id: 'selection-polygon-line',
		type: 'line',
		source: 'selectionSelected',
		filter: isPolygon,
		paint: {
			'line-width': 1,
			'line-color': colorRegular
		}
	},
	{
		id: 'selection-polygon-fill',
		type: 'fill',
		source: 'selectionSelected',
		filter: isPolygon,
		paint: {
			'fill-color': colorRegular,
			'fill-opacity': 0.2
		}
	}
];

export const selectionStyle = {
	sources,
	layers,
	source: 'selection'
};
