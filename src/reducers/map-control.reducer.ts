import {
	ActionSetMapControlCRS,
	ActionSetMapControlMode,
	ActionSetMapControlZoom,
	Action, ActionSetMapControlCenter } from './actions';
import { MapControlData } from '../types';
import { GEOGRAPHIC, NAVIGATION_MODE } from '../constants';

const STATE: MapControlData = {
	CRS: GEOGRAPHIC,
	mode: NAVIGATION_MODE,
	zoom: 1,
	center: [0, 0]
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

	if (ActionSetMapControlZoom.validate(action)) {
		const { zoom } = ActionSetMapControlZoom.data(action);

		return {
			...state,
			zoom
		};
	}

	if (ActionSetMapControlCenter.validate(action)) {
		const { center } = ActionSetMapControlCenter.data(action);

		return {
			...state,
			center
		};
	}

	return state;
};
