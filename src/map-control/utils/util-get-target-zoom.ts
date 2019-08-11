import { getBounds } from './util-get-bounds';
import { geoDistance } from './util-geo';
import {
	Box,
	Feature, Geometry
} from '../../types';

export const getTargetZoom = (features: Feature<Geometry>[], box: Box) => {
	const [a, b] = getBounds(features);

	const width = geoDistance(a, [b[0], a[1]]);
	const height = geoDistance(a, [a[0], b[1]]);

	const ppmW = box.width / width;
	const ppmH = box.height / height;

	const ppm = Math.min(ppmW, ppmH);

	return Math.log2(156543.03392 * Math.cos(b[1] * Math.PI / 180) * ppm);
};
