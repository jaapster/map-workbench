import { Co } from '../../types';
import {
	coToLl,
	geoProject } from '../../utils/util-geo';

export const analyseRectangle = ([cos]: Co[][], nv: number) => {
	// get the coordinate indices of the points
	// opposite, clockwise and counter clockwise from
	// the reference point (typically the one that is dragged)
	const n0 = [2, 3, 0, 1, 2][nv];
	const n1 = [1, 2, 3, 0, 1][nv];
	const n2 = [3, 0, 1, 2, 3][nv];

	// get screen positions for the coordinates
	const p0 = geoProject(coToLl(cos[n0]));
	const p1 = geoProject(coToLl(cos[n1]));
	const p2 = geoProject(coToLl(cos[n2]));
	const p3 = geoProject(coToLl(cos[nv]));

	return { p0, p1, p2, p3, n0, n1, n2 };
};
