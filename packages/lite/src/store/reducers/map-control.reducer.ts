import { newPolygon } from 'lite/utils/util-geo-json';
import { NAVIGATION_MODE } from 'lite/constants';
import {
	Action,
	ActionSetGlare,
	ActionToggleOverview,
	ActionSetOverviewOffset,
	ActionSetMapControlMode,
	ActionSetMapControlZoom,
	ActionSetMapControlCenter,
	ActionSetMapControlMetrics } from 'lite/store/actions/actions';
import {
	Co,
	MapControlData } from 'se';

const zero: Co = [0, 0];

const STATE: MapControlData = {
	mode: NAVIGATION_MODE,
	zoom: 1,
	pitch: 0,
	glare: false,
	mouse: zero,
	center: zero,
	bearing: 0,
	glareLevel: 21,
	overviewOffset: 3,
	overviewVisible: false,
	extent: newPolygon([[zero, zero, zero, zero, zero]])
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
		const { zoom, pitch, mouse, center, extent, bearing } = ActionSetMapControlMetrics.data(action);

		return {
			...state,
			zoom,
			pitch,
			mouse,
			center: state.center.join() !== center.join()
				? center
				: state.center,
			extent: state.extent.geometry.coordinates.toString() !== extent.geometry.coordinates.toString()
				? extent
				: state.extent,
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

	if (ActionSetOverviewOffset.validate(action)) {
		return {
			...state,
			overviewOffset: ActionSetOverviewOffset.data(action).offset
		};
	}

	return state;
};
