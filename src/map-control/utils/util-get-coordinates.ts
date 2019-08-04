import { Co, Feature } from '../../types';
import {
	LINE_STRING,
	MULTI_LINE_STRING,
	MULTI_POINT, MULTI_POLYGON,
	POINT,
	POLYGON, RECTANGLE
} from '../../constants';

export const getCoordinates = (features: Feature<any>[]) => {
	return features.reduce((m, { geometry: { coordinates, type } }) => {
		return type === POINT
			? m.concat([coordinates])
			: type === LINE_STRING || type === MULTI_POINT
				? m.concat(coordinates)
				: type === POLYGON || type === MULTI_LINE_STRING || type === RECTANGLE
					? m.concat(coordinates.flat(1))
					: type === MULTI_POLYGON
						? m.concat(coordinates.flat(2))
						: m;
	}, [] as Co[]);
};
