import React from 'react';
import { Co } from '../../types';
import { Polygon } from './cp-polygon';

interface Props {
	id: string;
	coordinates: Co[][];
	selected: boolean;
}

export const Rectangle = ({ id, coordinates, selected }: Props) => {
	return (
		<Polygon id={ id } coordinates={ coordinates } selected={ selected } />
	);
};
