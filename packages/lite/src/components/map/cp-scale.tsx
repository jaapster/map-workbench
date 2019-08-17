import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { MapControl } from 'lite/misc/map-control/map-control';
import { ActionToggleUnitSystem } from 'lite/store/actions/actions';
import {
	center,
	unitSystem } from 'lite/store/selectors/index.selectors';
import {
	METRIC,
	SCALE_BASE_WIDTH } from 'lite/constants';
import {
	Co,
	State,
	UnitSystem } from 'se';
import {
	feetToMeters,
	mToFt,
	milesToMeters } from 'lite/utils/util-conversion';

interface Props {
	center: Co;
	toggle: () => void;
	unitSystem: UnitSystem;
}

const getFoo = (f: number) => {
	const digits = Math.log(f) * Math.LOG10E | 0;
	const baseNumber = 10 ** (digits);
	return [digits, ([5, 2].find(l => f / baseNumber >= l) || 1) * baseNumber];
};

const getMetricScale = (m: number): [number, string] => {
	const [digits, n] = getFoo(m);
	return [n, digits < 3 ? `${ n } m` : `${ n / 1000 } km`];
};

const getImperialScale = (m: number): [number, string] => {
	const f = mToFt(m);
	const mile = f / 5280;

	if (mile < 1) {
		const [, n] = getFoo(f);
		return [feetToMeters(n), `${ n } ft`];
	}

	const [, n] = getFoo(mile);
	return [milesToMeters(n), `${ n } mile`];
};

export const _Scale = React.memo(({ center, unitSystem, toggle }: Props) => {
	const mpp = MapControl.getMetersPerPixel(center);
	const [scale, label] = unitSystem === METRIC
		? getMetricScale(mpp * SCALE_BASE_WIDTH)
		: getImperialScale(mpp * SCALE_BASE_WIDTH);

	return (
		<div
			className="scale"
			style={ { width: scale / mpp } }
			onClick={ toggle }
		>
			<span>
				{ label }
			</span>
			<div className="bar" />
		</div>
	);
});

const mapStateToProps = (state: State) => (
	{
		center: center(state),
		unitSystem: unitSystem(state)
	}
);

const mapDispatchToProps = (dispatch: Dispatch) => (
	{
		toggle() {
			dispatch(ActionToggleUnitSystem.create({}));
		}
	}
);

export const Scale = connect(mapStateToProps, mapDispatchToProps)(_Scale);
