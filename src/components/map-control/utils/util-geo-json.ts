import {
	dis,
	rot } from './util-point';
import {
	Co,
	Feature,
	MultiPoint } from '../../../types';
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

export const multiPointToCircle = (feature: Feature<MultiPoint>) => {
	const { geometry: { coordinates: [co1, co2] } } = feature;

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
	// const surface = Math.PI * (radius ** 2);

	return [
		{
			type: FEATURE,
			geometry: {
				type: POLYGON,
				coordinates: [coordinates]
			},
			properties: {
				type: POLYGON
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
				text: circumference.toFixed(PRECISION)
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
				text: radius.toFixed(PRECISION)
			}
		} // ,
		// {
		// 	type: FEATURE,
		// 	geometry: {
		// 		type: POINT,
		// 		coordinates: co1
		// 	},
		// 	properties: {
		// 		type: 'Center',
		// 		text: surface.toFixed(PRECISION)
		// 	}
		// }
	];
};
