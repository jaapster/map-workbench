import { Action, ActionSetMapControlCRS, ActionSetMapControlMode } from './actions';
import { MapControlData } from '../types';
import { NAVIGATION_MODE } from '../constants';

const STATE: MapControlData = {
	CRS: 4326,
	mode: NAVIGATION_MODE
};

export const mapControlReducer = (state: MapControlData = STATE, action: Action) => {
	if (ActionSetMapControlMode.validate(action)) {
		const { mode } = ActionSetMapControlMode.data(action);

		return {
			...state,
			mode
		};
	}

	if (ActionSetMapControlCRS.validate(action)) {
		const { CRS } = ActionSetMapControlCRS.data(action);

		return {
			...state,
			CRS
		};
	}

	return state;
};
