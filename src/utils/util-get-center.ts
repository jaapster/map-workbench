import { Co, Feature, Geometry } from '../types';
import { getBounds } from './util-get-bounds';

export const getCenter = (features: Feature<Geometry>[]) => {
	const [a, b] = getBounds(features);

	return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] as Co;
} ;
