import { oc } from 'ts-optchain';
import {
	Co,
	Point,
	Feature,
	Polygon,
	ProjectFn,
	MultiPoint,
	LineString,
	UnprojectFn,
	FeatureCollection } from '../../../../types';
import {
	getDistance,
	getDistanceToSegment,
	nearestPointOnSegment } from '../../utils/util-math';
import {
	lngLatToCo,
	coToLngLat } from '../../utils/util-lng-lat-to-co';
import {
	POINT,
	CIRCLE,
	POLYGON,
	MULTI_POINT,
	LINE_STRING,
	MULTI_LINE_STRING } from '../../../../services/constants';

export const toLngLat = ([lng, lat]: Co): any => ({ lng, lat });

export const nearestPointOnGeometry = (
	p0: Point,
	data: FeatureCollection,
	project: ProjectFn,
	unproject: UnprojectFn
) => (
	data.features.reduce((m1, feature, i) => {
		const { geometry: { type, coordinates }, properties } = feature;

		if (type === POINT) {
			const [lng, lat] = coordinates as Co;
			const distance = getDistance(p0, project({ lng, lat }));
			return distance < m1.distance ? { distance, index: [i], coordinate: [] } : m1;
		}

		if (type === LINE_STRING) {
			return (feature as Feature<LineString>).geometry.coordinates.reduce((m2, c, j, xs) => {
				if (j > 0) {
					const p1 = project(coToLngLat(c));
					const p2 = project(coToLngLat(xs[j - 1]));

					const distance = getDistanceToSegment(p0, p1, p2);

					if (distance < m2.distance) {
						const { x, y } = nearestPointOnSegment(p0, p1, p2);
						const { lng, lat } = unproject({ x, y });

						return { distance, index: [i, j], coordinate: [lng, lat] };
					}
				}

				return m2;
			}, m1);
		}

		if (type === POLYGON || type === MULTI_LINE_STRING) {
			return (feature as Feature<Polygon>).geometry.coordinates.reduce((m2, c2, j) => {
				return c2.reduce((m3, c, k, xs) => {
					if (k > 0) {
						const p1 = project(coToLngLat(c));
						const p2 = project(coToLngLat(xs[k - 1]));

						const distance = getDistanceToSegment(p0, p1, p2);

						if (distance < m3.distance) {
							const { x, y } = nearestPointOnSegment(p0, p1, p2);
							const { lng, lat } = unproject({ x, y });

							return { distance, index: [i, j, k], coordinate: [lng, lat] };
						}
					}

					return m3;
				}, m2);
			}, m1);
		}

		if (type === MULTI_POINT) {
			if (oc(properties).type() === CIRCLE) {
				const [co1, co2] = (feature as Feature<MultiPoint>).geometry.coordinates;

				const p1 = project(coToLngLat(co1));
				const p2 = project(coToLngLat(co2));

				const r = getDistance(p1, p2);
				const v = { x: p0.x - p1.x, y: p0.y - p1.y };
				const l = Math.sqrt(v.x ** 2 + v.y ** 2);

				const inter = {
					x: (v.x / l) * r + p1.x,
					y: (v.y / l) * r + p1.y
				};

				const distance = getDistance(p0, inter);

				return distance < m1.distance
					? {
						index: [i],
						distance,
						coordinate: lngLatToCo(unproject(inter))
					}
					: m1;
			}
		}

		return m1;
	}, { distance: Infinity, index: [-1], coordinate: [] })
);