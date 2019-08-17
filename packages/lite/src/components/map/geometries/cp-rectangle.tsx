import React from 'react';
import { Co } from 'se';
import { PolygonSVG } from './cp-polygon';

interface Props {
	id: string;
	selected: boolean;
	coordinates: Co[][];
}

export const RectangleSVG = React.memo(({ id, coordinates, selected }: Props) => {
	return (
		<PolygonSVG
			id={ id }
			coordinates={ coordinates }
			selected={ selected }
		/>
	);
});
