import {
	CIRCLE,
	LINE_STRING,
	MULTI_LINE_STRING, MULTI_POLYGON, POINT,
	POLYGON, RECTANGLE
} from '../../../constants';
import { Co, FeatureData } from '../../../types';
import { geoDistance } from '../../../map-control/utils/util-geo';

const RADIUS = 6378137;

function rad(num: number) {
	return num * Math.PI / 180;
}

export const getRadius = (feature: FeatureData<any>) => {
	if (feature.properties.type === CIRCLE) {
		const { geometry: { coordinates } } = feature;

		return getLineLength(coordinates);
	}

	return 0;
};

export const getLineLength = (cos: Co[]) => {
	return cos.reduce((m, co, i, l: Co[]) => !i ? m : m + geoDistance(co,
	l[i - 1]), 0);
};

const addLength = (m: number, co: Co[]) => m + getLineLength(co);

const round = (d: number) => (v: number) => Math.round(v * (10 ** d)) / (10 ** d);

export const getFeatureLength = (feature: FeatureData<any>) => {
	const {
		properties: { type },
		geometry: { coordinates }
	} = feature;

	return type === LINE_STRING
		? getLineLength(coordinates)
		: [MULTI_LINE_STRING, POLYGON, RECTANGLE].includes(type)
			? coordinates.reduce(addLength, 0)
			: type === MULTI_POLYGON
				? coordinates.flat().reduce(addLength, 0)
				: type === CIRCLE
					? 2 * Math.PI * getRadius(feature)
					: 0;
};

export const getRingArea = (cos: Co[]) => {
	let p1;
	let p2;
	let p3;
	let lowerIndex;
	let middleIndex;
	let upperIndex;
	let i;
	let total = 0;
	const coordsLength = cos.length;

	if (coordsLength > 2) {
		for (i = 0; i < coordsLength; i += 1) {
			if (i === coordsLength - 2) { // i = N-2
				lowerIndex = coordsLength - 2;
				middleIndex = coordsLength - 1;
				upperIndex = 0;
			} else if (i === coordsLength - 1) { // i = N-1
				lowerIndex = coordsLength - 1;
				middleIndex = 0;
				upperIndex = 1;
			} else { // i = 0 to N-3
				lowerIndex = i;
				middleIndex = i + 1;
				upperIndex = i + 2;
			}
			p1 = cos[lowerIndex];
			p2 = cos[middleIndex];
			p3 = cos[upperIndex];
			total += (rad(p3[0]) - rad(p1[0])) * Math.sin(rad(p2[1]));
		}

		total = total * RADIUS * RADIUS / 2;
	}

	return total;
};

export const getPolygonArea = (cos: Co[][]) => {
	let total = 0;

	if (cos && cos.length > 0) {
		total += Math.abs(getRingArea(cos[0]));
		for (let i = 1; i < cos.length; i += 1) {
			total -= Math.abs(getRingArea(cos[i]));
		}
	}

	return total;
};

export const getFeatureArea = (feature: FeatureData<any>) => {
	const { geometry: { coordinates }, properties: { type } } = feature;

	let total = 0;
	let i;

	switch (type) {
		case POLYGON:
		case RECTANGLE:
			return getPolygonArea(coordinates);
		case MULTI_POLYGON:
			for (i = 0; i < coordinates.length; i += 1) {
				total += getPolygonArea(coordinates[i]);
			}
			return total;
		case CIRCLE:
			return (getRadius(feature) ** 2) * Math.PI;
		default:
			return null;
	}
};

export const getCoordinate = (feature: FeatureData<any>) => {
	const {
		properties: { type },
		geometry: { coordinates }
	} = feature;

	return type === POINT
		? coordinates.map(round(6))
		: type === CIRCLE
			? coordinates[0].map(round(6))
			: null;
};

