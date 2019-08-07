import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { unitSystem } from '../../reducers/selectors/index.selectors';
import { RadioButtons } from './cp-radio-buttons';
import { ActionSetUnitSystem } from '../../reducers/actions';
import {
	State,
	UnitSystem } from '../../types';
import {
	IMPERIAL,
	METRIC } from '../../constants';

interface Props {
	unitSystem: UnitSystem;
	unitSystems: [string, string][];
	setUnitSystem: (unitSystem: UnitSystem) => void;
}

export const _UnitSystemSelector = React.memo(({ unitSystem, unitSystems, setUnitSystem }: Props) => (
	<RadioButtons
		label="Unit system"
		options={ unitSystems }
		value={ unitSystem }
		onChange={ setUnitSystem }
	/>
));

const mapStateToProps = (state: State) => (
	{
		unitSystem: unitSystem(state),
		unitSystems: [[METRIC, METRIC], [IMPERIAL, IMPERIAL]] as [string, string][]
	}
);

const mapDispatchToProps = (dispatch: Dispatch) => (
	{
		setUnitSystem(unitSystem: UnitSystem) {
			dispatch(ActionSetUnitSystem.create({ unitSystem }));
		}
	}
);

export const UnitSystemSelector = connect(mapStateToProps, mapDispatchToProps)(_UnitSystemSelector);

