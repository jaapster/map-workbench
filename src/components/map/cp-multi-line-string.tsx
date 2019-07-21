import React from 'react';
import { Co } from '../../types';
import { LineString } from './cp-line-string';

interface Props {
	id: string;
	coordinates: Co[][];
	selected: boolean;
}

export const MultiLineString = ({ id, coordinates, selected }: Props) => {
	return (
		<g>
			{
				coordinates.map((c, i) => (
					<LineString
						key={ i }
						id={ id }
						coordinates={ c }
						selected={ selected }
					/>
				))
			}
		</g>
	);
};
