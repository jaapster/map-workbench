import React from 'react';
import { Co } from '../../types';
import {
	coToLl,
	geoProject,
	geoUnproject,
	llToCo
} from '../../map-control/utils/util-geo';
import { dis, rot } from '../../map-control/utils/util-point';
import { mergeClasses } from '../../utils/util-merge-classes';
import { addToPath } from './utils/util-add-to-path';

interface Props {
	id: string;
	coordinates: Co[];
	selected: boolean;
}

export const multiPointToCircle = ([co1, co2]: Co[]) => {
	const c = geoProject(coToLl(co1));
	const r = geoProject(coToLl(co2));

	const d = dis(c, r);
	const n = Math.round(Math.sqrt(d) * 5);
	const a = Math.PI / (n / 2);

	const coordinates = Array(n)
		.fill(1)
		.map((e, i) => (llToCo(geoUnproject(rot(r, c, a * i)))))
		.concat([llToCo(geoUnproject(rot(r, c, 0)))]);

	// const radius = geoDis(coToLl(co1), coToLl(co2));
	// const circumference = 2 * Math.PI * radius;

	return [coordinates, [co1, co2]];
};

export const Circle = ({ coordinates, selected }: Props) => {
	const className = mergeClasses(
		'point',
		{
			selected
		}
	);

	return (
		<g>
			{
				multiPointToCircle(coordinates).map((l, i) => (
					<path
						key={ i }
						className={ className }
						d={ l.reduce(addToPath, '') }
						markerStart={ selected ? 'url(#vertex)' : '' }
						markerEnd={ selected ? 'url(#vertex)' : '' }
					/>
				))
			}
		</g>
	);
};
