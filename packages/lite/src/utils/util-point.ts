import { Pt } from 'se';

export const dis = (p0: Pt, p1: Pt) => (
	Math.sqrt((p0.x - p1.x) ** 2 + (p0.y - p1.y) ** 2)
);

export const sub = (p0: Pt, p1: Pt) => (
	{
		x: p0.x - p1.x,
		y: p0.y - p1.y
	}
);

export const add = (p0: Pt, p1: Pt) => (
	{
		x: p0.x + p1.x,
		y: p0.y + p1.y
	}
);

export const div = (p0: Pt, f: number) => (
	{
		x: p0.x / f,
		y: p0.y / f
	}
);

export const mul = (p0: Pt, f: number) => (
	{
		x: p0.x * f,
		y: p0.y * f
	}
);

export const hyp = ({ x, y }: Pt) => (
	Math.sqrt(x ** 2 + y ** 2)
);

export const ang = (p0: Pt, p1: Pt) => (
	Math.atan2(p1.y - p0.y, p1.x - p0.x)
);

export const rot = (p0: Pt, po: Pt, t: number) => {
	const { x, y } = sub(p0, po);

	const c = Math.cos(t);
	const s = Math.sin(t);

	return add({ x: x * c - y * s, y: y * c + x * s }, po);
};
