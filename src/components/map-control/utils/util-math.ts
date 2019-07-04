import { Point } from '../../../types';
import { clamp } from '../../../utils/util-clamp';

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

const _nearest = (p: Point, a: Point, b: Point, constrain: boolean) => {
	const atob = { x: b.x - a.x, y: b.y - a.y };
	const atop = { x: p.x - a.x, y: p.y - a.y };
	const len = atob.x * atob.x + atob.y * atob.y;
	const dot = atop.x * atob.x + atop.y * atob.y;
	const t = constrain
		? Math.min(1, Math.max(0, dot / len))
		: dot / len;
	return { x: a.x + atob.x * t, y: a.y + atob.y * t };
};

export const nearestPointOnSegment = (p: Point, [a, b]: [Point, Point]) => {
	return _nearest(p, a, b, true);
};

export const nearestPointOnLine = (p: Point, [a, b]: [Point, Point]) => {
	return _nearest(p, a, b, false);
};
