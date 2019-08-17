import { Co, Pt } from 'se';
import { clamp } from './util-clamp';
import { ang } from './util-point';

export const getDistanceToSegment = (p0: Pt, p1: Pt, p2: Pt) => {
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

const _nearest = (p: Pt, a: Pt, b: Pt, constrain: boolean) => {
	const atob = { x: b.x - a.x, y: b.y - a.y };
	const atop = { x: p.x - a.x, y: p.y - a.y };
	const len = atob.x * atob.x + atob.y * atob.y;
	const dot = atop.x * atob.x + atop.y * atob.y;
	const t = constrain
		? Math.min(1, Math.max(0, dot / len))
		: dot / len;
	return { x: a.x + atob.x * t, y: a.y + atob.y * t };
};

export const nearestPointOnSegment = (p: Pt, [a, b]: [Pt, Pt]) => {
	return _nearest(p, a, b, true);
};

export const nearestPointOnLine = (p: Pt, [a, b]: [Pt, Pt]) => {
	return _nearest(p, a, b, false);
};

export const pointAtLength = ([p0, p1]: Pt[], l: number) => {
	const t = ang(p0, p1);

	return {
		x: p0.x + (l * Math.cos(t)),
		y: p0.y + (l * Math.sin(t))
	};
};

export const signedArea = (xs: Pt[]) => (
	xs.reduce((m, { x, y }, i, s) => (
		m + ((s[(i + 1) % s.length].x - x) * (s[(i + 1) % s.length].y + y)) / 2
	), 0)
);

export const isClockwise = (xs: Co[]) => (
	xs.reduce((m, [x, y], i, s) => (
		m + ((s[(i + 1) % s.length][0] - x) * (s[(i + 1) % s.length][1] + y))
	), 0) > 0
);
