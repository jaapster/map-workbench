import React from 'react';
import { Co } from '../../../types';
import { Polygon } from './cp-polygon';

interface Props {
	id: string;
	selected: boolean;
	coordinates: Co[][][];
}

export const MultiPolygon = ({ id, coordinates, selected }: Props) => {
	return (
		<g>
			{
				coordinates.map((c, i) => (
					<Polygon
						key={ `${ id }-${ i }` }
						id={ `${ id }-${ i }` }
						coordinates={ c }
						selected={ selected }
					/>
				))
			}
		</g>
	);
};
