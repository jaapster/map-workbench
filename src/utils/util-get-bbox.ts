import { BBox } from '../types';
import { coToLl, geoProject, geoUnproject, llToCo } from './util-geo';
import { dis, rot } from './util-point';

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

export const getCircleBBox = ([co1, co2]: any): BBox => {
	const c = geoProject(coToLl(co1));
	const r = geoProject(coToLl(co2));

	const d = dis(c, r);
	const n = Math.round(Math.sqrt(d) * 5);
	const a = Math.PI / (n / 2);

	const cos = Array(n)
		.fill(1)
		.map((e, i) => (llToCo(geoUnproject(rot(r, c, a * i)))))
		.concat([llToCo(geoUnproject(rot(r, c, 0)))]);

	return getBBox(cos);
};
