import React from 'react';
import { Co } from 'se';
import { PolygonSVG } from './cp-polygon';

interface Props {
	id: string;
	selected: boolean;
	coordinates: Co[][][];
}

export const MultiPolygonSVG = React.memo(({ id, coordinates, selected }: Props) => {
	return (
		<g>
			{
				coordinates.map((c, i) => (
					<PolygonSVG
						key={ `${ id }-${ i }` }
						id={ `${ id }-${ i }` }
						coordinates={ c }
						selected={ selected }
					/>
				))
			}
		</g>
	);
});
