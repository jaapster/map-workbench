interface Point {
	x: number;
	y: number;
}

export const getDistance = (p0: Point, p1: Point) => (
	Math.sqrt((p0.x - p1.x) ** 2 + (p0.y - p1.y) ** 2)
);
