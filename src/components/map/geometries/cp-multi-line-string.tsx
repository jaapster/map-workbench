import React from 'react';
import { Co } from '../../../types';
import { LineStringSVG } from './cp-line-string';

interface Props {
	id: string;
	selected: boolean;
	coordinates: Co[][];
}

export const MultiLineStringSVG = React.memo(({ id, coordinates, selected }: Props) => {
	return (
		<g>
			{
				coordinates.map((c, i) => (
					<LineStringSVG
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
