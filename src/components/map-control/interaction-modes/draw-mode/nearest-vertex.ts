import {
	Co,
	LngLat,
	Feature,
	FeatureCollection
} from '../../../../types';
import {
	POINT,
	POLYGON,
	MULTI_POINT,
	LINE_STRING,
	MULTI_POLYGON,
	MULTI_LINE_STRING
} from '../../../../services/constants';
import { dis } from '../../utils/util-point';
import { geoProject } from '../../utils/util-geo';
import { coToLngLat } from '../../utils/util-lng-lat-to-co';

interface Result {
	index: number[];
	distance: number;
	coordinate: Co | null;
}

// returns coordinate of geometry nearest to screen position
export const nearest = (lngLat: LngLat, coordinates: Co[], index: number[]) => (
	coordinates.reduce((m: any, co: Co, i) => {
		const distance = dis( geoProject(lngLat), geoProject(coToLngLat(co)));

		return distance < m.distance ? {
			coordinate: co,
			distance,
			index: [...index, i]
		} : m;
	}, { coordinate: null, distance: Infinity, index })
);

export const nearestVertex = (lngLat: LngLat, data: FeatureCollection) => (
	data.features.reduce((m1: Result, { geometry: { type, coordinates }, properties }: Feature<any>, i: number) => {
		if (type === POINT) {
			const [lng, lat] = coordinates as Co;
			const distance = dis(geoProject(lngLat), geoProject({ lng, lat }));
			return distance < m1.distance ? {
				coordinate: coordinates,
				distance,
				index: [i]
			} : m1;
		}

		if (type === LINE_STRING || type === MULTI_POINT) {
			const closest = nearest(lngLat, coordinates as Co[], [i]);
			return closest.distance < m1.distance ? closest : m1;

		}

		if (type === POLYGON || type === MULTI_LINE_STRING) {
			return (coordinates as Co[][]).reduce((m2: Result, ring, j: number) => {
				const closest = nearest(lngLat, ring, [i, j]);
				return closest.distance < m2.distance ? closest : m2;
			}, m1);
		}

		if (type === MULTI_POLYGON) {
			return (coordinates as Co[][][]).reduce((m2: Result, poly, j: number) => (
				poly.reduce((m3: Result, ring: any, k: number) => {
					const closest = nearest(lngLat, ring, [i, j, k]);
					return closest.distance < m3.distance ? closest : m3;
				}, m2)
			), m1);
		}

		return m1;
	}, { coordinate: null, distance: Infinity, index: [] })
);
