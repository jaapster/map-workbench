import { Co, Feature, Geometry } from '../types';
import {
	POINT,
	POLYGON,
	MULTI_POINT,
	LINE_STRING,
	MULTI_POLYGON,
	MULTI_LINE_STRING } from '../constants';

export const getCoordinates = (features: Feature<Geometry>[]) => (
	features.reduce((m, { geometry: { coordinates, type } }) => (
		type === POINT
			? m.concat([coordinates as Co])
			: type === LINE_STRING || type === MULTI_POINT
				? m.concat(coordinates as Co[])
				: type === POLYGON || type === MULTI_LINE_STRING
					? m.concat(coordinates.flat(1))
					: type === MULTI_POLYGON
						? m.concat(coordinates.flat(2))
						: m
	), [] as Co[])
);
