import { SettingsData } from '../types';
import {
	Action,
	ActionSetUIScale,
	ActionSetUnitSystem,
	ActionToggleUnitSystem } from './actions/actions';
import {
	IMPERIAL,
	METRIC } from '../constants';

const STATE: SettingsData = {
	scales: [1, 1.1, 1.2, 1.5],
	scale: 1,
	language: 'en',
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

	if (ActionSetUIScale.validate(action)) {
		return {
			...state,
			scale: ActionSetUIScale.data(action).UIScale
		};
	}

	return state;
};
