import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { unitSystem } from '../../reducers/selectors/index.selectors';
import { ActionSetUnitSystem } from '../../reducers/actions';
import {
	State,
	UnitSystem } from '../../types';
import {
	Button,
	ButtonGroup } from './cp-button';
import {
	IMPERIAL,
	METRIC } from '../../constants';

interface Props {
	unitSystem: UnitSystem;
	activateMetric: () => void;
	activateImperial: () => void;
}

export const _UnitSystemSelector = React.memo(({ unitSystem, activateMetric, activateImperial }: Props) => (
	<div>
		<h3>Unit system</h3>
		<ButtonGroup>
			<Button
				onClick={ activateMetric }
				depressed={ unitSystem === METRIC }
			>
				Metric
			</Button>
			<Button
				onClick={ activateImperial }
				depressed={ unitSystem === IMPERIAL }
			>
				Imperial
			</Button>
		</ButtonGroup>
	</div>
));

const mapStateToProps = (state: State) => (
	{
		unitSystem: unitSystem(state)
	}
);

const mapDispatchToProps = (dispatch: Dispatch) => (
	{
		activateMetric() {
			dispatch(ActionSetUnitSystem.create({ unitSystem: METRIC }));
		},
		activateImperial() {
			dispatch(ActionSetUnitSystem.create({ unitSystem: IMPERIAL }));
		}
	}
);

export const UnitSystemSelector = connect(mapStateToProps, mapDispatchToProps)(_UnitSystemSelector);

