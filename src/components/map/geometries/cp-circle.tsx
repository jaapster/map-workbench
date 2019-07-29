import React from 'react';
import { Co } from '../../../types';
import { Segment } from '../cp-segment';
import { addToPath } from '../utils/util-add-to-path';
import { mergeClasses } from '../../app/utils/util-merge-classes';
import { multiPointToLines } from '../../../map-control/utils/util-geo-json';

interface Props {
	id: string;
	selected: boolean;
	coordinates: Co[];
}

export const Circle = ({ coordinates, selected, id }: Props) => {
	const className = mergeClasses(
		'circle',
		{
			selected
		}
	);

	const cos = multiPointToLines(coordinates);

	return (
		<g>
			<path
				className={ className }
				d={ cos[0].reduce(addToPath, '') }
			/>
			<path
				className={ className }
				d={ cos[1].reduce(addToPath, '') }
			/>
			{
				selected
					? (
						<Segment
							id={id}
							selected={selected}
							coordinates={cos[1]}
						/>
					)
					: null
			}
		</g>
	);
};
