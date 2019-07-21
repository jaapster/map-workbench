import React from 'react';
import { Co } from '../../types';
import { MapControl } from '../../map-control/map-control';
import { coToLl } from '../../map-control/utils/util-geo';
import { mergeClasses } from '../../utils/util-merge-classes';

interface Props {
	id: string;
	coordinates: Co;
	selected: boolean;
}

export const Point = ({ coordinates, selected }: Props) => {
	const { x, y } = MapControl.project(coToLl(coordinates));

	const className = mergeClasses(
		'point',
		{
			selected
		}
	);

	return (
		<circle
			className={ className }
			cx={ x }
			cy={ y }
			r={ 4 }
		/>
	);
};
