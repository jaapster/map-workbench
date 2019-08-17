import { ApplicationInfoData } from 'se';
import {
	Action,
	ActionSetApplicationInfo } from 'lite/store/actions/actions';

const STATE: ApplicationInfoData = {
	anonymousLoginAllowed: false,
	automaticLoginEnabled: false,
	projects: [],
	settings: {}
};

export const applicationReducer = (state: ApplicationInfoData = STATE, action: Action): ApplicationInfoData => {
	if (ActionSetApplicationInfo.validate(action)) {
		return ActionSetApplicationInfo.data(action).application;
	}

	return state;
};
