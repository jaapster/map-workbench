import {
	Feature,
	ProjectFn,
	MultiPoint,
	UnprojectFn } from '../../../types';
import { lngLatToCo, coToLngLat } from './util-lng-lat-to-co';
import { dis, rot } from './util-point';
import { FEATURE, POLYGON } from '../../../services/constants';

export const multiPointToCircle = (
	feature: Feature<MultiPoint>,
	project: ProjectFn,
	unproject: UnprojectFn
) => {
	const { geometry: { coordinates: [co1, co2] } } = feature;

	const c = project(coToLngLat(co1));
	const r = project(coToLngLat(co2));

	const d = dis(c, r);
	const n = Math.round(Math.sqrt(d) * 5);
	const a = Math.PI / (n / 2);

	return {
		type: FEATURE,
		geometry: {
			type: POLYGON,
			coordinates: [
				Array(n)
					.fill(1)
					.map((e, i) => (lngLatToCo(unproject(rot(r, c, a * i)))))
					.concat([lngLatToCo(unproject(rot(r, c, 0)))])
			]
		},
		properties: {}
	};
};
