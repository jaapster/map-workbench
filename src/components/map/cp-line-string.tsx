import React from 'react';
import { Co } from '../../types';
import { Segments } from './cp-segmented';

interface Props {
	id: string;
	coordinates: Co[];
	selected: boolean;
}

export const LineString = ({ coordinates, selected, id }: Props) => {
	return (
		<Segments
			id={ id }
			coordinates={ [coordinates] }
			selected={ selected }
		/>
	);
};
