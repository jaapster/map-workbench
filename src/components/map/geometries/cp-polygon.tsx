import React from 'react';
import { Co } from '../../../types';
import { Segments } from '../cp-segments';
import { addToPath } from '../utils/util-add-to-path';
import { mergeClasses } from '../../app/utils/util-merge-classes';

interface Props {
	id: string;
	selected: boolean;
	coordinates: Co[][];
}

export const Polygon = ({ id, coordinates, selected }: Props) => {
	const className = mergeClasses(
		'polygon',
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
							coordinates={ coordinates }
							selected={ selected }
						/>
					)
					: (
						<path
							fillRule="evenodd"
							className={ className }
							d={
								coordinates.reduce((m, c) => c.reduce(addToPath, m), '')
							}
						/>
					)
			}
		</g>
	);
};
