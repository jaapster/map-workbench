import {
	Co,
	LngLat,
	Feature,
	FeatureCollection, Geometry
} from '../../types';
import {
	POINT,
	POLYGON,
	MULTI_POINT,
	LINE_STRING,
	MULTI_POLYGON,
	MULTI_LINE_STRING } from '../../constants';
import { dis } from '../../utils/util-point';
import { coToLl, geoProject } from '../../utils/util-geo';

interface Result {
	index: number[];
	distance: number;
	coordinate: Co | null;
}

// returns coordinate of geometry nearest to screen position
export const nearest = (lngLat: LngLat, coordinates: Co[], index: number[]) => (
	coordinates.reduce((m: any, co: Co, i) => {
		const distance = dis(geoProject(lngLat), geoProject(coToLl(co)));

		return distance < m.distance
			? {
				coordinate: co,
				distance,
				index: [...index, i]
			}
			: m;
	}, { coordinate: null, distance: Infinity, index })
);

export const getNearestVertex = (lngLat: LngLat, data: FeatureCollection) => (
	data.features.reduce((
		m1: Result,
		{ geometry: { type, coordinates: co1 }, properties }: Feature<Geometry>,
		i: number
	) => {
		if (type === POINT) {
			const n = nearest(lngLat, [co1] as Co[], [i]);
			return n.distance < m1.distance ? { ...n, index: [n.index[0]] } : m1;
		}

		if (type === LINE_STRING || type === MULTI_POINT) {
			const n = nearest(lngLat, co1 as Co[], [i]);
			return n.distance < m1.distance ? n : m1;
		}

		if (type === POLYGON || type === MULTI_LINE_STRING) {
			return (co1 as Co[][])
				.reduce((m2: Result, co2, j: number) => {
					const n = nearest(lngLat, co2, [i, j]);
					return n.distance < m2.distance ? n : m2;
				}, m1);
		}

		if (type === MULTI_POLYGON) {
			return (co1 as Co[][][])
				.reduce((m2: Result, co2, j: number) => (
					co2.reduce((m3: Result, co3: any, k: number) => {
						const n = nearest(lngLat, co3, [i, j, k]);
						return n.distance < m3.distance ? n : m3;
					}, m2)
			), m1);
		}

		return m1;
	}, { coordinate: null, distance: Infinity, index: [] })
);
