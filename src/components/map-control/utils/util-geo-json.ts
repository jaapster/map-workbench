import uuid from 'uuid/v1';
import {
	dis,
	rot } from './util-point';
import {
	Bounds,
	Co,
	Feature,
	MultiPoint
} from '../../../types';
import {
	// POINT,
	FEATURE,
	POLYGON,
	SEGMENT,
	PRECISION,
	LINE_STRING } from '../../../constants';
import {
	llToCo,
	coToLl,
	geoDis,
	geoProject,
	geoUnproject } from './util-geo';
import { toPairs } from './util-list';

export const newLineString = (coordinates: Co[] = []) => (
	{
		type: FEATURE,
		geometry: {
			type: LINE_STRING,
			coordinates
		},
		properties: {
			type: LINE_STRING,
			id: uuid()
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
			type: POLYGON,
			id: uuid()
		}
	}
);

export const multiPointToCircle = (feature: Feature<MultiPoint>) => {
	const { geometry: { coordinates: [co1, co2] }, properties: { id } } = feature;

	const c = geoProject(coToLl(co1));
	const r = geoProject(coToLl(co2));

	const d = dis(c, r);
	const n = Math.round(Math.sqrt(d) * 5);
	const a = Math.PI / (n / 2);

	const coordinates = Array(n)
		.fill(1)
		.map((e, i) => (llToCo(geoUnproject(rot(r, c, a * i)))))
		.concat([llToCo(geoUnproject(rot(r, c, 0)))]);

	const radius = geoDis(coToLl(co1), coToLl(co2));
	const circumference = 2 * Math.PI * radius;

	return [
		{
			type: FEATURE,
			geometry: {
				type: POLYGON,
				coordinates: [coordinates]
			},
			properties: {
				type: POLYGON,
				id
			}
		},
		{
			type: FEATURE,
			geometry: {
				type: LINE_STRING,
				coordinates
			},
			properties: {
				type: SEGMENT,
				text: circumference.toFixed(PRECISION),
				id
			}
		},
		{
			type: FEATURE,
			geometry: {
				type: LINE_STRING,
				coordinates: [co1, co2]
			},
			properties: {
				type: SEGMENT,
				text: radius.toFixed(PRECISION),
				id
			}
		}
	];
};

export const getBounds = (feature: Feature<any>): Bounds => {
	const { geometry: { coordinates } } = feature;

	const cos: Co[] = toPairs(coordinates.flat(4));

	const lng = cos.map(([lng]) => lng);
	const lat = cos.map(([, lat]) => lat);

	return [
		[Math.min(...lng), Math.min(...lat)],
		[Math.max(...lng), Math.max(...lat)]
	];
};
