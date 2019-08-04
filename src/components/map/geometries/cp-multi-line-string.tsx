import React from 'react';
import { Co } from '../../../types';
import { LineString } from './cp-line-string';

interface Props {
	id: string;
	selected: boolean;
	coordinates: Co[][];
}

export const MultiLineString = React.memo(({ id, coordinates, selected }: Props) => {
	return (
		<g>
			{
				coordinates.map((c, i) => (
					<LineString
						id={ `${ id }-${ i }` }
						key={ `${ id }-${ i }` }
						selected={ selected }
						coordinates={ c }
					/>
				))
			}
		</g>
	);
});
