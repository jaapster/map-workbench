import { BBox } from '../types';

export const getBBox = (cos: any): BBox => (
	cos.flat(4).reduce((m: BBox, n: number, i: number) => (
		[
			i % 2 ? m[0] : Math.min(n, m[0]),
			i % 2 ? Math.min(n, m[1]) : m[1],
			i % 2 ? m[2] : Math.max(n, m[2]),
			i % 2 ? Math.max(n, m[3]) : m[3]
		]
	), [Infinity, Infinity, -Infinity, -Infinity])
);
