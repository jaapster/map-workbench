import React from 'react';
import { Co } from '../../../types';
import { Segments } from '../cp-segments';
import { addToPath } from '../utils/util-add-to-path';
import { mergeClasses } from '../../app/utils/util-merge-classes';

interface Props {
	id: string;
	coordinates: Co[];
	selected: boolean;
}

export const LineString = ({ coordinates, selected, id }: Props) => {
	const className = mergeClasses(
		'line',
		{
			selected
		}
	);

	return (
		<g>
			{
				selected
					? (
						<Segments
							id={ id }
							coordinates={ [coordinates] }
							selected={ selected }
						/>
					)
					: (
						<path
							className={ className }
							d={ coordinates.reduce(addToPath, '') }
						/>
					)
			}
		</g>
	);
};
