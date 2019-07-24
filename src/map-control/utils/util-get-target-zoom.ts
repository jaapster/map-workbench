import { Co, Feature } from '../../types';
import {
	POINT,
	POLYGON,
	RECTANGLE,
	LINE_STRING,
	MULTI_POINT,
	MULTI_POLYGON,
	MULTI_LINE_STRING
} from '../../constants';
import { geoDistance } from './util-geo';

interface Box {
	width: number;
	height: number;
}

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

export const getEnvelope = (features: Feature<any>[]) => {
	const cos = getCoordinates(features);

	return [
		[
			cos.reduce((m, [v]: Co) => v < m ? v : m, Infinity),
			cos.reduce((m, [, v]: Co) => v < m ? v : m, Infinity)
		],
		[
			cos.reduce((m, [v]: Co) => v > m ? v : m, -Infinity),
			cos.reduce((m, [, v]: Co) => v > m ? v : m, -Infinity)
		]
	];
};

export const getTargetZoom = (features: Feature<any>[], box: Box) => {
	const [a, b] = getEnvelope(features);

	const width = geoDistance(a, [b[0], a[1]]);
	const height = geoDistance(a, [a[0], b[1]]);
	const maxDim = Math.max(width, height);

	const pixelsPerMeter = maxDim === width
		? box.width / maxDim
		: box.height / maxDim;

	const zoom = Math.log2(
		156543.03392 * Math.cos(b[1] * Math.PI / 180) * pixelsPerMeter
	) - 1;

	return Math.floor(zoom);
};
