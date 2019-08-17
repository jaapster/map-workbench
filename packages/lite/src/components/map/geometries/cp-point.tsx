import React from 'react';
import { extent } from 'lite/store/selectors/index.selectors';
import { connect } from 'react-redux';
import { MapControl } from 'lite/misc/map-control/map-control';
import { mergeClasses } from 'lite/utils/util-merge-classes';
import {
	Co,
	State } from 'se';

interface Props {
	id: string;
	selected: boolean;
	coordinates: Co;
}

export const _Point = React.memo(({ coordinates, selected }: Props) => {
	const { x, y } = MapControl.project(coordinates);

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
			r={ 3 }
		/>
	);
});

const mapStateToProps = (state: State) => (
	{
		extent: extent(state)
	}
);

export const PointSVG = connect(mapStateToProps)(_Point);
