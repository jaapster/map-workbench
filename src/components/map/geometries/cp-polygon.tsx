import React from 'react';
import { Co } from '../../../types';
import { Segments } from '../cp-segments';
import { addToPath } from '../utils/util-add-to-path';
import { mergeClasses } from '../../app/utils/util-merge-classes';

interface Props {
	id: string;
	coordinates: Co[][];
	selected: boolean;
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
			<path
				fillRule="evenodd"
				className={ className }
				d={
					coordinates.reduce((m, c) => c.reduce(addToPath, m), '')
				}
			/>
			{
				selected
					? (
						<Segments
							id={ id }
							coordinates={ coordinates }
							selected={ selected }
						/>
					)
					: null
			}
		</g>
	);
};
