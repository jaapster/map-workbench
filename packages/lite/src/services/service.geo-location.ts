import { Co } from 'se';
import { dispatch } from 'lite/store/store';
import { ActionSetGeoLocationPosition } from 'lite/store/actions/actions';

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
