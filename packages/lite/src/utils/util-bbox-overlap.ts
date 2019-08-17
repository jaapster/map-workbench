import { BBox } from 'se';

export const bboxOverlap = ([a, b, c, d]: BBox, [e, f, g, h]: BBox) => (
	!(a > g || b > h || c < e || d < f)
);
