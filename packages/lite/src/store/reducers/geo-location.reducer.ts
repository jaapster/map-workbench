import { GeoLocationData } from 'se';
import { Action, ActionSetGeoLocationPosition } from 'lite/store/actions/actions';

const STATE: GeoLocationData = {
	position: [0, 0],
	accuracy: 0,
	follow: false,
	trace: false
};

export const geoLocationReducer = (state: GeoLocationData = STATE, action: Action): GeoLocationData => {
	if (ActionSetGeoLocationPosition.validate(action)) {
		const { position, accuracy } = ActionSetGeoLocationPosition.data(action);

		return {
			...state,
			position,
			accuracy
		};
	}

	return state;
};
