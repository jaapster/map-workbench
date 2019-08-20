import React from 'react';
import { connect } from 'react-redux';
import { MapControl } from 'lite/misc/map-control/map-control';
import {
	Co,
	EPSG,
	State } from 'se';
import {
	currentCRS,
	center } from 'lite/store/selectors/index.selectors';

interface Props {
	CRS: EPSG;
	center: Co;
}

export const _CenterCoordinate = React.memo(({ center, CRS }: Props) => {
	const c = MapControl.projectToCRS(center, CRS);

	if (c == null) {
		return null;
	}

	const [x, y] = c;

	const hasDecimals = Math.round(x) !== x;

	return (
		<div className="button-group">
			<div className="label">
				{
					hasDecimals ? x.toFixed(6) : x
				}, {
					hasDecimals ? y.toFixed(6) : y
				} (EPSG:{ CRS })
			</div>
		</div>
	);
});

const mapStateToProps = (state: State) => (
	{
		CRS: currentCRS(state),
		center: center(state)
	}
);

export const CenterCoordinate = connect(mapStateToProps)(_CenterCoordinate);
