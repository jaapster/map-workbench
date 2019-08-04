import uuid from 'uuid/v1';
import {
	dis,
	rot } from './util-point';
import {
	Co,
	Feature,
	MultiPoint } from '../../types';
import {
	CIRCLE,
	FEATURE,
	POLYGON,
	SEGMENT,
	PRECISION,
	LINE_STRING, POINT, MULTI_POINT, RECTANGLE
} from '../../constants';
import {
	llToCo,
	coToLl,
	geoDistance,
	geoProject,
	geoUnproject } from './util-geo';

export const newPoint = (coordinates: Co) => (
	{
		type: FEATURE,
		geometry: {
			type: POINT,
			coordinates
		},
		properties: {
			type: POINT,
			id: uuid()
		}
	}
);

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

export const newCircle = (coordinates: Co[] = []) => (
	{
		type: FEATURE,
		geometry: {
			type: MULTI_POINT,
			coordinates
		},
		properties: {
			type: CIRCLE,
			id: uuid()
		}
	}
);

export const newRectangle = (coordinates: Co[][] = [[]]) => (
	{
		type: FEATURE,
		geometry: {
			type: POLYGON,
			coordinates
		},
		properties: {
			type: RECTANGLE,
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

export const render = (features: Feature<any>[]) => {
	return features.reduce((m, feature) => {
		if (feature.properties.type === CIRCLE) {
			return m.concat(multiPointToCircle(feature));
		}

		return m.concat(feature);
	}, [] as Feature<any>[]);
};
