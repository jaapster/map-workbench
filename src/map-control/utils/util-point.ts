import { Point } from '../../types';

export const dis = (p0: Point, p1: Point) => (
	Math.sqrt((p0.x - p1.x) ** 2 + (p0.y - p1.y) ** 2)
);

export const sub = (p0: Point, p1: Point) => (
	{
		x: p0.x - p1.x,
		y: p0.y - p1.y
	}
);

export const add = (p0: Point, p1: Point) => (
	{
		x: p0.x + p1.x,
		y: p0.y + p1.y
	}
);

export const div = (p0: Point, f: number) => (
	{
		x: p0.x / f,
		y: p0.y / f
	}
);

export const mul = (p0: Point, f: number) => (
	{
		x: p0.x * f,
		y: p0.y * f
	}
);

export const hyp = ({ x, y }: Point) => (
	Math.sqrt(x ** 2 + y ** 2)
);

export const ang = (p0: Point, p1: Point) => (
	Math.atan2(p1.y - p0.y, p1.x - p0.x)
);

export const rot = (p0: Point, po: Point, t: number) => {
	const { x, y } = sub(p0, po);

	const c = Math.cos(t);
	const s = Math.sin(t);

	return add({ x: x * c - y * s, y: y * c + x * s }, po);
};
