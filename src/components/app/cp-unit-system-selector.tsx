import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { lang, unitSystem } from '../../reducers/selectors/index.selectors';
import { RadioButtons } from './cp-radio-buttons';
import { ActionSetUnitSystem } from '../../reducers/actions';
import {
	LanguagePack,
	State,
	UnitSystem
} from '../../types';
import {
	IMPERIAL,
	METRIC } from '../../constants';

interface Props {
	lang: LanguagePack;
	unitSystem: UnitSystem;
	unitSystems: [string, string][];
	setUnitSystem: (unitSystem: UnitSystem) => void;
}

export const _UnitSystemSelector = React.memo(({ lang, unitSystem, unitSystems, setUnitSystem }: Props) => (
	<RadioButtons
		label={ lang.settings.unitSystem }
		options={ unitSystems.map(([key, value]) => [lang.settings[key], value]) }
		value={ unitSystem }
		onChange={ setUnitSystem }
	/>
));

const systems = [[METRIC, METRIC], [IMPERIAL, IMPERIAL]];

const mapStateToProps = (state: State) => (
	{
		lang: lang(state),
		unitSystem: unitSystem(state),
		unitSystems: systems as [string, string][]
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

