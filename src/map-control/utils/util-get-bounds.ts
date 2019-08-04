import { render } from './util-geo-json';
import { getCoordinates } from './util-get-coordinates';
import {
	Co,
	Bounds,
	Feature } from '../../types';

export const getBounds = (features: Feature<any>[]): Bounds => {
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
