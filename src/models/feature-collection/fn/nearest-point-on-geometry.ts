import {
	Co,
	Point,
	FeatureCollection, LngLat } from '../../../types';
import {
	getDistanceToSegment,
	nearestPointOnSegment } from '../../../map-control/utils/util-math';
import {
	POINT,
	CIRCLE,
	POLYGON,
	MULTI_POINT,
	LINE_STRING,
	MULTI_POLYGON,
	MULTI_LINE_STRING } from '../../../constants';
import {
	add,
	sub,
	mul,
	div,
	dis,
	hyp } from '../../../map-control/utils/util-point';
import {
	llToCo,
	coToLl,
	geoProject,
	geoUnproject } from '../../../map-control/utils/util-geo';

const roll = (p0: Point, index: number[]) =>
	(m: any, co: Co, i: number, xs: any) => {
		if (i > 0) {
			const p1 = geoProject(coToLl(co));
			const p2 = geoProject(coToLl(xs[i - 1]));
			const distance = getDistanceToSegment(p0, p1, p2);

			if (distance < m.distance) {
				return {
					index: [...index, i],
					distance,
					coordinate: llToCo(
						geoUnproject(nearestPointOnSegment(p0, [p1, p2]))
					)
				};
			}
		}

		return m;
	};

export const nearestPointOnGeometry = (
	lngLat: LngLat,
	data: FeatureCollection,
	project: any = geoProject,
	unproject: any = geoUnproject
) => {
	const p0 = project(lngLat);

	return data.features.reduce((m1, feature, i) => {
		const { geometry: { type, coordinates }, properties } = feature;

		if (type === POINT) {
			const d = dis(p0, project(coToLl(coordinates as Co)));
			return d < m1.distance
				? { distance: d, index: [i], coordinate: coordinates }
				: m1;
		}

		if (type === MULTI_POINT) {
			if (properties.type === CIRCLE) {
				const [co1, co2] = coordinates as Co[];

				const p1 = project(coToLl(co1));
				const p2 = project(coToLl(co2));
				const p3 = sub(p0, p1);

				const px = add(mul(div(p3, hyp(p3)), dis(p1, p2)), p1);
				const distance = dis(p0, px);

				return distance < m1.distance
					? {
						index: [i],
						distance,
						coordinate: llToCo(unproject(px))
					}
					: m1;
			}
		}

		return type === LINE_STRING
			? (coordinates as Co[]).reduce(roll(p0, [i]), m1)
			: type === POLYGON || type === MULTI_LINE_STRING
				? (coordinates as Co[][]).reduce((m2, c2, j) => (
					c2.reduce(roll(p0, [i, j]), m2)
				), m1)
				: type === MULTI_POLYGON
					? (coordinates as Co[][][]).reduce((m2, c2, j) => (
						c2.reduce((m3, c3, k) => (
							c3.reduce(roll(p0, [i, j, k]), m3)
						), m2)
					), m1)
					: m1;
	}, { distance: Infinity, index: [-1], coordinate: [0, 0] });
};
