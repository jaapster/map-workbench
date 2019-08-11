import React from 'react';
import { Co } from '../../../types';
import { PointSVG } from './cp-point';

interface Props {
	id: string;
	selected: boolean;
	coordinates: Co[];
}

export const MultiPointSVG = React.memo(({ coordinates, selected, id }: Props) => {
	return (
		<g>
			{
				coordinates.map((c, i) => (
					<PointSVG
						key={ i }
						id={ `${ id }-${ i }` }
						coordinates={ c }
						selected={ selected }
					/>
				))
			}
		</g>
	);
});
