import { Co } from '../types';
import { dispatch } from '../reducers/store';
import { ActionSetGeoLocationPosition } from '../reducers/actions';

navigator.geolocation.watchPosition((p: any) => {
	const { coords: { longitude, latitude, accuracy } } = p;

	const position = [
		longitude,
		latitude
	] as Co;

	dispatch(ActionSetGeoLocationPosition.create({ position, accuracy }));
});

export const GeoLocationService = {
	toggleFollowPosition() {

	},

	toggleTracePosition() {

	}
};
