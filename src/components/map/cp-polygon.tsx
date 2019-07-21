import React from 'react';
import { Co } from '../../types';
import { Segments } from './cp-segmented';
import { addToPath } from './utils/util-add-to-path';
import { mergeClasses } from '../../utils/util-merge-classes';

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
					// @ts-ignore
					coordinates.reduce((m, c) => c.reduce(addToPath, m), '')
				}
			/>
			<Segments
				id={ id }
				coordinates={ coordinates }
				selected={ selected }
			/>
		</g>
	);
};
