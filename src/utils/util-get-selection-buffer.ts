import { Pt } from '../types';
import { MapControl } from '../misc/map-control/map-control';
import { newLineString } from './util-geo-json';
import {
	add,
	sub } from './util-point';

export const getSelectionBuffer = (p0: Pt) => {
	const co0 = MapControl.unproject(add(p0, { x: 3, y: 3 }));
	const co1 = MapControl.unproject(sub(p0, { x: 3, y: 3 }));

	return newLineString([co0, co1]).geometry;
};
