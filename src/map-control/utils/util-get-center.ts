import { Co, FeatureData } from '../../types';
import { getEnvelope } from './util-get-envelope';

export const getCenter = (features: FeatureData<any>[]) => {
	const [a, b] = getEnvelope(features);

	return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] as Co;
} ;
