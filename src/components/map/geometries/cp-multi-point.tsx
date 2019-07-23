import React from 'react';
import { Co } from '../../../types';
import { Point } from './cp-point';

interface Props {
	id: string;
	coordinates: Co[];
	selected: boolean;
}

export const MultiPoint = ({ coordinates, selected, id }: Props) => {
	return (
		<g>
			{
				coordinates.map((co, i) => (
					<Point
						key={ i }
						id={ `${ id }-${ i }` }
						coordinates={ co }
						selected={ selected }
					/>
				))
			}
		</g>
	);
};
