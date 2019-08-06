import { MapControlData } from '../types';
import {
	Action,
	ActionToggleOverview,
	ActionSetMapControlMode,
	ActionSetMapControlZoom,
	ActionSetMapControlCenter,
	ActionSetMapControlMetrics } from './actions';
import {
	FEATURE,
	POLYGON,
	NAVIGATION_MODE } from '../constants';

const STATE: MapControlData = {
	mode: NAVIGATION_MODE,
	zoom: 1,
	center: [0, 0],
	overviewVisible: false,
	extent: {
		type: FEATURE,
		geometry: {
			type: POLYGON,
			coordinates: [[[0, 0], [0, 0], [0, 0], [0, 0]]]
		},
		properties: {
			id: 'extent',
			type: POLYGON
		}
	}
};

export const mapControlReducer = (state: MapControlData = STATE, action: Action): MapControlData => {
	if (ActionSetMapControlMode.validate(action)) {
		const { mode } = ActionSetMapControlMode.data(action);

		return {
			...state,
			mode
		};
	}

	if (ActionSetMapControlMetrics.validate(action)) {
		const { zoom, center, extent } = ActionSetMapControlMetrics.data(action);

		return {
			...state,
			zoom,
			center,
			extent
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

	if (ActionToggleOverview.validate(action)) {
		return {
			...state,
			overviewVisible: !state.overviewVisible
		};
	}

	return state;
};
