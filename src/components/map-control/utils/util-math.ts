import { Point } from '../../../types';
import { clamp } from '../../../utils/util-clamp';

export const getDistance = (p0: Point, p1: Point) => (
	Math.sqrt((p0.x - p1.x) ** 2 + (p0.y - p1.y) ** 2)
);

export const getDistanceToSegment = (p0: Point, p1: Point, p2: Point) => {
	const ldx = p2.x - p1.x;
	const ldy = p2.y - p1.y;
	const lenSquared = ldx * ldx + ldy * ldy;

	// t === 0 at line pt 1 and t === 1 at line pt 2
	const t = lenSquared
		? clamp((((p0.x - p1.x) * ldx + (p0.y - p1.y) * ldy) / lenSquared), 0, 1)
		: 0;

	const dx = p0.x - (p1.x + t * ldx);
	const dy = p0.y - (p1.y + t * ldy);

	return Math.sqrt(dx * dx + dy * dy);
};

export const closestPointOnSegment = (p: Point, a: Point, b: Point) => {
    const v = [b.x - a.x, b.y - a.y];
    const u = [a.x - p.x, a.y - p.y];
    const vu = v[0] * u[0] + v[1] * u[1];
    const vv = v[0] ** 2 + v[1] ** 2;
    const t = -vu / vv;
    if (t >= 0 && t <= 1) return vectorToSegment2D(t, { x: 0, y: 0 }, a, b);
    const g0 = sqDiag2D(vectorToSegment2D(0, p, a, b))
    const g1 = sqDiag2D(vectorToSegment2D(1, p, a, b))
    return g0 <= g1 ? a : b
};

const vectorToSegment2D = (t: number, p: Point, a: Point, b: Point) => {
    return {
        x: (1 - t) * a.x + t * b.x - p.x,
        y: (1 - t) * a.y + t * b.y - p.y,
    };
};

const sqDiag2D = (p: Point) => p.x ** 2 + p.y ** 2;
