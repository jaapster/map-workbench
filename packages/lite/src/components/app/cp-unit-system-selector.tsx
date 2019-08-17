import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { lang, unitSystem } from 'lite/store/selectors/index.selectors';
import { RadioButtons } from './cp-radio-buttons';
import { ActionSetUnitSystem } from 'lite/store/actions/actions';
import {
	LanguagePack,
	State,
	UnitSystem
} from 'se';
import {
	IMPERIAL,
	METRIC } from 'lite/constants';
import { Collapsible } from './cp-collapsible';

interface Props {
	lang: LanguagePack;
	unitSystem: UnitSystem;
	unitSystems: [string, string][];
	setUnitSystem: (unitSystem: UnitSystem) => void;
}

export const _UnitSystemSelector = React.memo(({ lang, unitSystem, unitSystems, setUnitSystem }: Props) => (
	<Collapsible title={ lang.settings.unitSystem }>
		<RadioButtons
			value={ unitSystem }
			options={ unitSystems.map(([key, value]) => [lang.settings[key], value]) }
			onChange={ setUnitSystem }
		/>
	</Collapsible>
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

