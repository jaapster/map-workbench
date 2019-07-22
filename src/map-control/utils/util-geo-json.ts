import uuid from 'uuid/v1';
import { toPairs } from './util-list';
import {
	dis,
	rot } from './util-point';
import {
	Co,
	Bounds,
	Feature,
	MultiPoint } from '../../types';
import {
	POINT,
	CIRCLE,
	FEATURE,
	POLYGON,
	SEGMENT,
	PRECISION,
	LINE_STRING,
	MULTI_POINT,
	MULTI_LINE_STRING, RECTANGLE
} from '../../constants';
import {
	llToCo,
	coToLl,
	geoDistance,
	geoProject,
	geoUnproject
} from './util-geo';

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

export const multiPointToLines = ([co1, co2]: Co[]) => {
	const c = geoProject(coToLl(co1));
	const r = geoProject(coToLl(co2));

	const d = dis(c, r);
	const n = Math.round(Math.sqrt(d) * 5);
	const a = Math.PI / (n / 2);

	const coordinates = Array(n)
		.fill(1)
		.map((e, i) => (llToCo(geoUnproject(rot(r, c, a * i)))))
		.concat([llToCo(geoUnproject(rot(r, c, 0)))]);

	return [coordinates, [co1, co2]];
};

export const multiPointToCircle = (feature: Feature<MultiPoint>) => {
	const { geometry: { coordinates: [co1, co2] }, properties: { id } } = feature;

	const [coordinates] = multiPointToLines([co1, co2]);

	const radius = geoDistance(co1, co2);
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
	const { geometry: { coordinates } } = getEnvelope(feature);

	// envelope has a fixed order so we can do this
	return [
		coordinates[0],
		coordinates[2]
	];
};

export const getEnvelope = (feature: Feature<any>) => {
	const f = feature.properties.type === CIRCLE
		? multiPointToCircle(feature)[0]
		: feature;

	const { geometry: { coordinates } } = f;

	const cos: Co[] = toPairs(coordinates.flat(4));

	const lng = cos.map(([lng]) => lng);
	const lat = cos.map(([, lat]) => lat);

	return {
		type: FEATURE,
		geometry: {
			type: POLYGON, coordinates: [
				[Math.min(...lng), Math.min(...lat)],
				[Math.min(...lng), Math.max(...lat)],
				[Math.max(...lng), Math.max(...lat)],
				[Math.max(...lng), Math.min(...lat)],
				[Math.min(...lng), Math.min(...lat)]
			]
		},
		properties: {
			type: POLYGON
		}
	};
};

export const apply = (feature: Feature<any>, fn: (co: Co) => any) => {
	const { geometry: { coordinates }, properties: { type } } = feature;

	return {
		...feature,
		geometry: {
			coordinates: type === POINT
				? fn(coordinates)
				: type === LINE_STRING || type === MULTI_POINT || type === CIRCLE
					? (coordinates as Co[]).map(fn)
					: type === POLYGON || type === MULTI_LINE_STRING || type === RECTANGLE
						? (coordinates as Co[][]).map(c => c.map(fn))
						: (coordinates as Co[][][]).map(c => c.map(c => c.map(fn)))
		}
	};
};

export const project = (feature: Feature<any>) => (
	apply(feature, (co: Co) => {
		return geoProject(coToLl(co));
	})
);
