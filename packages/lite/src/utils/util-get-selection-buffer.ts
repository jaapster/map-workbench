import { Pt } from 'se';
import { PrimaryMapControl } from '../misc/map-control/primary-map-control';
import { newLineString } from './util-geo-json';
import {
	add,
	sub } from './util-point';

export const getSelectionBuffer = (p0: Pt) => {
	const co0 = PrimaryMapControl.unproject(add(p0, { x: 3, y: 3 }));
	const co1 = PrimaryMapControl.unproject(sub(p0, { x: 3, y: 3 }));

	return newLineString([co0, co1]).geometry;
};
