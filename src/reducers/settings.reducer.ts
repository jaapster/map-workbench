import { Action, ActionSetUnitSystem, ActionToggleUnitSystem } from './actions';
import { IMPERIAL, METRIC } from '../constants';
import { SettingsData } from '../types';

const STATE: SettingsData = {
	unitSystem: METRIC
};

export const settingsReducer = (state: SettingsData = STATE, action: Action): SettingsData => {
	if (ActionSetUnitSystem.validate(action)) {
		return {
			...state,
			unitSystem: ActionSetUnitSystem.data(action).unitSystem
		};
	}

	if (ActionToggleUnitSystem.validate(action)) {
		return {
			...state,
			unitSystem: state.unitSystem === METRIC ? IMPERIAL : METRIC
		};
	}

	return state;
};
