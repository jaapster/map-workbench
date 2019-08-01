import { Co, FeatureData } from '../../types';
import { render } from './util-geo-json';
import { getCoordinates } from './util-get-coordinates';

export const getEnvelope = (features: FeatureData<any>[]): [Co, Co] => {
	const cos = getCoordinates(render(features));

	return [
		[
			cos.reduce((m, [v]: Co) => v < m ? v : m, Infinity),
			cos.reduce((m, [, v]: Co) => v < m ? v : m, Infinity)
		],
		[
			cos.reduce((m, [v]: Co) => v > m ? v : m, -Infinity),
			cos.reduce((m, [, v]: Co) => v > m ? v : m, -Infinity)
		]
	];
};
