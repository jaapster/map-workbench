import { Co } from '../../../../types';
import { FEATURE, LINE_STRING, POLYGON } from '../../../../services/constants';

export const newLineString = (coordinates: Co[] = []) => (
	{
		type: FEATURE,
		geometry: {
			type: LINE_STRING,
			coordinates
		},
		properties: {
			type: LINE_STRING
		}
	}
);

export const newPolygon = (coordinates: Co[][] = [[]]) => (
	{
		type: FEATURE,
		geometry: {
			type: POLYGON,
			coordinates
		},
		properties: {
			type: POLYGON
		}
	}
);