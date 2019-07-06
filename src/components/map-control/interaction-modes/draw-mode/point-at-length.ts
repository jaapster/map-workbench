import { Point } from '../../../../types';
import { ang } from '../../utils/util-point';

export const pointAtLength = ([p0, p1]: Point[], l: number) => {
	const t = ang(p0, p1);

	return {
		x: p0.x + (l * Math.cos(t)),
		y: p0.y + (l * Math.sin(t))
	};
};
