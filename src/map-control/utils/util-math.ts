import { Co, Point } from '../../types';
import { clamp } from '../../utils/util-clamp';
import { ang } from './util-point';

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

export const pointAtLength = ([p0, p1]: Point[], l: number) => {
	const t = ang(p0, p1);

	return {
		x: p0.x + (l * Math.cos(t)),
		y: p0.y + (l * Math.sin(t))
	};
};

export const signedArea = (xs: Point[]) => (
	xs.reduce((m, { x, y }, i, s) => (
		m + ((s[(i + 1) % s.length].x - x) * (s[(i + 1) % s.length].y + y)) / 2
	), 0)
);

export const isClockwise = (xs: Co[]) => (
	xs.reduce((m, [x, y], i, s) => (
		m + ((s[(i + 1) % s.length][0] - x) * (s[(i + 1) % s.length][1] + y))
	), 0) > 0
);

/*

signed_area(const std::vector<point>& polygon) {
  double area = 0.0;

  unsigned j = 1;
  for (unsigned i = 0; i < polygon.size(); i++, j++) {
    j = j % polygon.size();

    area += (polygon[j].x - polygon[i].x)*(polygon[j].y + polygon[i].y);
  }

  return area / 2.0;
}

 */