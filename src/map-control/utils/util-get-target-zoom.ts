import { FeatureData } from '../../types';
import { geoDistance } from './util-geo';
import { getEnvelope } from './util-get-envelope';

interface Box {
	width: number;
	height: number;
}

export const getTargetZoom = (features: FeatureData<any>[], box: Box) => {
	const [a, b]: any = getEnvelope(features);

	const width = geoDistance(a, [b[0], a[1]]);
	const height = geoDistance(a, [a[0], b[1]]);

	const ppmW = box.width / width;
	const ppmH = box.height / height;

	const ppm = Math.min(ppmW, ppmH);

	return Math.log2(156543.03392 * Math.cos(b[1] * Math.PI / 180) * ppm);
};
