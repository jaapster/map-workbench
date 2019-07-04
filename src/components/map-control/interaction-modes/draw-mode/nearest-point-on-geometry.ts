import {
	Co,
	Point,
	ProjectFn,
	UnprojectFn,
	FeatureCollection } from '../../../../types';
import {
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
	MULTI_POLYGON,
	MULTI_LINE_STRING } from '../../../../services/constants';
import { add, sub, mul, div, dis, hyp } from '../../utils/util-point';

const roll = (
	p0: Point,
	index: number[],
	project: ProjectFn,
	unproject: UnprojectFn
) => (m: any, co: Co, i: number, xs: any) => {
	if (i > 0) {
		const p1 = project(coToLngLat(co));
		const p2 = project(coToLngLat(xs[i - 1]));
		const distance = getDistanceToSegment(p0, p1, p2);

		if (distance < m.distance) {
			const { x, y } = nearestPointOnSegment(p0, [p1, p2]);

			return {
				index: [...index, i],
				distance,
				coordinate: lngLatToCo(unproject({ x, y }))
			};
		}
	}

	return m;
};

export const nearestPointOnGeometry = (
	p0: Point,
	data: FeatureCollection,
	project: ProjectFn,
	unproject: UnprojectFn
) => (
	data.features.reduce((m1, feature, i) => {
		const { geometry: { type, coordinates }, properties } = feature;

		if (type === POINT) {
			const d = dis(p0, project(coToLngLat(coordinates as Co)));
			return d < m1.distance
				? { distance: d, index: [i], coordinate: [] }
				: m1;
		}

		if (type === MULTI_POINT) {
			if (properties.type === CIRCLE) {
				const [co1, co2] = coordinates as Co[];

				const p1 = project(coToLngLat(co1));
				const p2 = project(coToLngLat(co2));
				const p3 = sub(p0, p1);

				const px = add(mul(div(p3, hyp(p3)), dis(p1, p2)), p1);
				const distance = dis(p0, px);

				return distance < m1.distance
					? {
						index: [i],
						distance,
						coordinate: lngLatToCo(unproject(px))
					}
					: m1;
			}
		}

		return type === LINE_STRING
			? (coordinates as Co[]).reduce(roll(p0, [i], project, unproject), m1)
			: type === POLYGON || type === MULTI_LINE_STRING
				? (coordinates as Co[][]).reduce((m2, c2, j) => (
					c2.reduce(roll(p0, [i, j], project, unproject), m2)
				), m1)
				: type === MULTI_POLYGON
					? (coordinates as Co[][][]).reduce((m2, c2, j) => (
						c2.reduce((m3, c3, k) => (
							c3.reduce(roll(p0, [i, j, k], project, unproject), m3)
						), m2)
					), m1)
					: m1;
	}, { distance: Infinity, index: [-1], coordinate: [] })
);
