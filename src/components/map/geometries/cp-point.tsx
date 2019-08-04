import React from 'react';
import { Co, State } from '../../../types';
import { MapControl } from '../../../map-control/map-control';
import { mergeClasses } from '../../app/utils/util-merge-classes';
import { center } from '../../../reducers/selectors/index.selectors';
import { connect } from 'react-redux';

interface Props {
	id: string;
	center: Co;
	selected: boolean;
	coordinates: Co;
}

export const _Point = React.memo(({ coordinates, selected, center }: Props) => {
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

const mapStateToProps = (state: State) => {
	return {
		center: center(state)
	};
};

export const Point = connect(mapStateToProps)(_Point);
