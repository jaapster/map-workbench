import { ServerSettingsData } from 'se';
import {
	Action,
	ActionSetServerSettings } from 'lite/store/actions/actions';

const STATE: ServerSettingsData = {
	enumeratorValueProviders: {}
};

export const serverSettingsReducer = (state: ServerSettingsData = STATE, action: Action): ServerSettingsData => {
	if (ActionSetServerSettings.validate(action)) {
		return ActionSetServerSettings.data(action).settings;
	}

	return state;
};
