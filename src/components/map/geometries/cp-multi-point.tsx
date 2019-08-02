import React from 'react';
import { Co } from '../../../types';
import { Point } from './cp-point';

interface Props {
	id: string;
	selected: boolean;
	coordinates: Co[];
}

export const MultiPoint = ({ coordinates, selected, id }: Props) => {
	return (
		<g>
			{
				coordinates.map((c, i) => (
					<Point
						key={ i }
						id={ `${ id }-${ i }` }
						coordinates={ c }
						selected={ selected }
					/>
				))
			}
		</g>
	);
};
