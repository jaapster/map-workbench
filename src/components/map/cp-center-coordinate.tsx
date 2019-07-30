import React from 'react';
import { connect } from 'react-redux';
import { MapControl } from '../../map-control/map-control';
import {
	Co,
	EPSG,
	State } from '../../types';

interface Props {
	CRS: EPSG;
	center: Co;
}

export const _CenterCoordinate = React.memo(({ center, CRS }: Props) => {
	const [x, y] = MapControl.projectToCRS(center, CRS);

	const hasDecimals = Math.round(x) !== x;

	return (
		<div className="center-coordinate">
			{
				hasDecimals ? x.toFixed(6) : x
			}, {
				hasDecimals ? y.toFixed(6) : y
			}
		</div>
	);
});

const mapStateToProps = (state: State) => (
	{
		CRS: state.mapControl.CRS,
		center: state.mapControl.center
	}
);

export const CenterCoordinate = connect(mapStateToProps)(_CenterCoordinate);
