import { render } from './util-geo-json';
import { getCoordinates } from './util-get-coordinates';
import {
	Bounds,
	Feature,
	Geometry } from 'se';

export const getBounds = (features: Feature<Geometry>[]): Bounds => (
	getCoordinates(render(features)).reduce(([[a, b], [c, d]], co) => (
		[
			[
				Math.min(co[0], a),
				Math.min(co[1], b)
			],
			[
				Math.max(co[0], c),
				Math.max(co[1], d)
			]
		]
	), [[Infinity, Infinity], [-Infinity, -Infinity]])
);
