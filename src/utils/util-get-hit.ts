import { dis } from './util-point';
import { THRESHOLD } from '../constants';
import { getNearestVertex } from '../reducers/fn/get-nearest-vertex';
import { getNearestPointOnGeometry } from '../reducers/fn/get-nearest-point-on-geometry';
import {
	Pt,
	LngLat,
	FeatureCollection } from '../types';

export const getHit = (lngLat: LngLat, point: Pt, featureCollection: FeatureCollection, control: any) => {
	const {
		index: i1,
		coordinate: co1
	} = getNearestVertex(lngLat, featureCollection);

	if (co1 === null) {
		return null;
	}

	const p1 = control.project(co1);

	if (dis(point, p1) < THRESHOLD) {
		return i1;
	}

	const {
		index: i2,
		coordinate: co2
	} = getNearestPointOnGeometry(lngLat, featureCollection);

	if (co2 === null) {
		return null;
	}

	const p2 = control.project(co2);

	if (dis(point, p2) < THRESHOLD) {
		return [i2[0]];
	}

	return null;
};
