import React from 'react';
import { Co } from '../../types';
import { PRECISION } from '../../constants';
import { addToPath } from './utils/util-add-to-path';
import { geoDistance } from '../../map-control/utils/util-geo';
import { mergeClasses } from '../../utils/util-merge-classes';

interface Props {
	coordinates: Co[];
	selected: boolean;
	id: string;
}

export const Segment = ({ coordinates, selected, id }: Props) => {
	const className = mergeClasses(
		{
			'selected': selected
		}
	);

	const [a, b] = coordinates;

	return (
		<g>
			<path
				d={ [a, b].reduce(addToPath, '') }
				id={`${ id }-p`}
				className={ className }
				markerEnd={ selected ? 'url(#vertex)' : '' }
				markerStart={ selected ? 'url(#vertex)' : '' }
			/>
			{
				selected
					? (
						<text dy="13">
							<textPath
								href={ `#${ id }-p` }
								startOffset="50%"
							>
								{
									geoDistance(a, b).toFixed(PRECISION)
								}
							</textPath>
						</text>
					)
					: null
			}
		</g>
	);
};
