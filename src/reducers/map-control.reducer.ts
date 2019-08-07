import { MapControlData } from '../types';
import {
	Action,
	ActionToggleOverview,
	ActionSetMapControlMode,
	ActionSetMapControlZoom,
	ActionSetMapControlCenter,
	ActionSetMapControlMetrics, ActionSetGlare
} from './actions';
import {
	FEATURE,
	POLYGON,
	NAVIGATION_MODE } from '../constants';

const STATE: MapControlData = {
	mode: NAVIGATION_MODE,
	zoom: 1,
	pitch: 0,
	glare: false,
	center: [0, 0],
	bearing: 0,
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
		const { zoom, pitch, center, extent, bearing } = ActionSetMapControlMetrics.data(action);

		return {
			...state,
			zoom,
			pitch,
			center,
			extent,
			bearing
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

	if (ActionSetGlare.validate(action)) {
		return {
			...state,
			glare: ActionSetGlare.data(action).glare
		};
	}

	return state;
};
