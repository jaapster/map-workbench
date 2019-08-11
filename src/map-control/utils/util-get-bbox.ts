import {
	Co,
	BBox } from '../../types';

export const getBBox = (cos: Co[]): BBox => {
	return cos.reduce((m, co) => (
		[
			Math.min(co[0], m[0]),
			Math.min(co[1], m[1]),
			Math.max(co[0], m[2]),
			Math.max(co[1], m[3])
		]
	), [Infinity, Infinity, -Infinity, -Infinity]);
};
