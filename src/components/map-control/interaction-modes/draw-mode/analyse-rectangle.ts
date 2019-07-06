import { Co } from '../../../../types';
import { geoProject } from '../../utils/util-geo';
import { coToLngLat } from '../../utils/util-lng-lat-to-co';

export const analyseRectangle = (coordinates: Co[][], nv: number) => {
	const [cos] = coordinates;

	// get the coordinate indices of the points
	// opposite, clockwise and counter clockwise from
	// the point that is dragged
	const n0 = [2, 3, 0, 1, 2][nv];
	const n1 = [1, 2, 3, 0, 1][nv];
	const n2 = [3, 0, 1, 2, 3][nv];

	// get screen positions for the coordinates
	const p0 = geoProject(coToLngLat(cos[n0]));
	const p1 = geoProject(coToLngLat(cos[n1]));
	const p2 = geoProject(coToLngLat(cos[n2]));
	const p3 = geoProject(coToLngLat(cos[nv]));

	return { p0, p1, p2, p3, n0, n1, n2 };
};
