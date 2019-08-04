import React from 'react';
import { Co } from '../../../types';
import { Polygon } from './cp-polygon';

interface Props {
	id: string;
	selected: boolean;
	coordinates: Co[][];
}

export const Rectangle = React.memo(({ id, coordinates, selected }: Props) => {
	return (
		<Polygon
			id={ id }
			coordinates={ coordinates }
			selected={ selected }
		/>
	);
});
