import React from 'react';
import { center } from '../../reducers/selectors/index.selectors';
import { connect } from 'react-redux';
import { MapControl } from '../../map-control/map-control';
import { SCALE_BASE_WIDTH } from '../../constants';
import {
	Co,
	State } from '../../types';

interface Props {
	center: Co;
}

const getNormalizedScale = (m: number): [number, string] => {
	const digits = Math.log(m) * Math.LOG10E | 0;
	const baseNumber = 10 ** (digits);
	const n = ([7.5, 5, 2.5].find(l => m / baseNumber >= l) || 1) * baseNumber;

	return [n, digits < 4 ? `${ n } m` : `${ n / 1000 } km`];
};

export const _Scale = React.memo(({ center }: Props) => {
	const mpp = MapControl.getMetersPerPixel(center);
	const [scale, label] = getNormalizedScale(mpp * SCALE_BASE_WIDTH);

	return (
		<div className="scale" style={ { width: scale / mpp } }>
			<span>
				{ label }
			</span>
		</div>
	);
});

const mapStateToProps = (state: State) => (
	{
		center: center(state)
	}
);

export const Scale = connect(mapStateToProps)(_Scale);
