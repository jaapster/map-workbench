import {
	Co,
	Point,
	Feature,
	Polygon,
	ProjectFn,
	LineString,
	UnprojectFn,
	FeatureCollection } from '../../../../types';
import {
	getDistance,
	getDistanceToSegment,
	closestPointOnSegment } from '../../utils/util-math';
import { toLngLat } from '../../utils/util-map';
import {
	POINT,
	POLYGON,
	LINE_STRING,
	MULTI_LINE_STRING } from '../../../../services/constants';

export const nearestPointOnGeometry = (p0: Point, data: FeatureCollection, project: ProjectFn, unproject: UnprojectFn) => {
	return data.features.reduce((m1, feature, i) => {
		const { geometry: { type, coordinates } } = feature;

		if (type === POINT) {
			const [lng, lat] = coordinates as Co;
			const distance = getDistance(p0, project({ lng, lat }));
			return distance < m1.distance ? { distance, index: [i], coordinate: [] } : m1;
		}

		if (type === LINE_STRING) {
			return (feature as Feature<LineString>).geometry.coordinates.reduce((m2, c, j, xs) => {
				if (j > 0) {
					const p1 = project(toLngLat(c));
					const p2 = project(toLngLat(xs[j - 1]));

					const distance = getDistanceToSegment(p0, p1, p2);

					if (distance < m2.distance) {
						const { x, y } = closestPointOnSegment(p0, p1, p2);
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
						const p1 = project(toLngLat(c));
						const p2 = project(toLngLat(xs[k - 1]));

						const distance = getDistanceToSegment(p0, p1, p2);

						if (distance < m3.distance) {
							const { x, y } = closestPointOnSegment(p0, p1, p2);
							const { lng, lat } = unproject({ x, y });

							return { distance, index: [i, j, k], coordinate: [lng, lat] };
						}
					}

					return m3;
				}, m2);
			}, m1);
		}

		return m1;
	}, { distance: Infinity, index: [-1], coordinate: [] });
};
