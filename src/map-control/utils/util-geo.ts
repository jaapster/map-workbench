import { Co, LngLat, Point } from '../../types';
import { clamp } from '../../utils/util-clamp';

const R = 6378137.0;
const MAX_EXTENT = 20037508.342789244;

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

export const geoDistance = (_a: Co, _b: Co) => {
	const a = coToLl(_a);
	const b = coToLl(_b);

	const lat = (b.lat - a.lat) * D2R;
	const lng = (b.lng - a.lng) * D2R;
	const v =
		Math.sin(lat / 2) ** 2 +
		Math.cos((a.lat * D2R)) * Math.cos(b.lat * D2R) *
		Math.sin(lng / 2) ** 2
	;
	const c = 2 * Math.atan2(Math.sqrt(v), Math.sqrt(1 - v));
	return R * c; // distance in m
};

// to mercator
export const geoProject = ({ lng, lat }: LngLat) => {
	const pt = {
		x: R * lng * D2R,
		y: R * Math.log(Math.tan((Math.PI * 0.25) + (0.5 * lat * D2R)))
	};

	// if xy value is beyond max extent (e.g. poles), return max extent.
	pt.x = clamp(pt.x, -MAX_EXTENT, MAX_EXTENT);
	pt.y = clamp(pt.y, -MAX_EXTENT, MAX_EXTENT);

	return pt;
};

// to wgs84
export const geoUnproject = ({ x, y }: Point) => {
	return {
		lng: (x * R2D / R),
		lat: ((Math.PI * 0.5) - 2.0 * Math.atan(Math.exp(-y / R))) * R2D
	};
};

export const llToCo = ({ lng, lat }: LngLat): Co => [lng, lat];

export const coToLl = ([lng, lat]: Co): LngLat => ({ lng, lat });
