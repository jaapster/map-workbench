import { dis } from '../../utils/util-point';
import {
	Co,
	Point,
	LngLat,
	Feature,
	FeatureCollection
} from '../../../../types';
import {
	POINT,
	CIRCLE,
	POLYGON,
	MULTI_POINT,
	LINE_STRING,
	MULTI_POLYGON,
	MULTI_LINE_STRING
} from '../../../../services/constants';

interface Result {
	index: number[];
	distance: number;
	coordinate: Co | null;
}

// returns coordinate of geometry nearest to screen position
export const nearest = (
	pos: Point,
	coordinates: Co[],
	index: number[],
	project: (c: LngLat) => Point
) => (
	coordinates.reduce((m: any, coordinate: Co, i) => {
		const [lng, lat] = coordinate;
		const distance = dis(pos, project({ lng, lat }));

		return distance < m.distance ? { coordinate, distance, index: [...index, i] } : m;
	}, { coordinate: null, distance: Infinity, index })
);

export const nearestVertex = (pos: Point, data: FeatureCollection, project: (c: LngLat) => Point) => (
	data.features.reduce((m1: Result, { geometry: { type, coordinates }, properties }: Feature<any>, i: number) => {
		if (type === POINT) {
			const [lng, lat] = coordinates as Co;
			const distance = dis(pos, project({ lng, lat }));
			return distance < m1.distance ? { coordinate: coordinates, distance, index: [i] } : m1;
		}

		if (type === LINE_STRING || type === MULTI_POINT) {
			if (properties && properties.type === CIRCLE) {

			}
			const closest = nearest(pos, coordinates as Co[], [i], project);
			return closest.distance < m1.distance ? closest : m1;

		}

		if (type === POLYGON || type === MULTI_LINE_STRING) {
			return (coordinates as Co[][]).reduce((m2: Result, ring, j: number) => {
				const closest = nearest(pos, ring, [i, j], project);
				return closest.distance < m2.distance ? closest : m2;
			}, m1);
		}

		if (type === MULTI_POLYGON) {
			return (coordinates as Co[][][]).reduce((m2: Result, poly, j: number) => (
				poly.reduce((m3: Result, ring: any, k: number) => {
					const closest = nearest(pos, ring, [i, j, k], project);
					return closest.distance < m3.distance ? closest : m3;
				}, m2)
			), m1);
		}

		return m1;
	}, { coordinate: null, distance: Infinity, index: [] })
);
