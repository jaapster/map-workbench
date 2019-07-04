import { Co, LngLat } from '../../../types';

export const lngLatToCo = ({ lng, lat }: LngLat): Co => [lng, lat];

export const coToLngLat = ([lng, lat]: Co): LngLat => ({ lng, lat });