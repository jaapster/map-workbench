import { Co } from '../../../types';
import { MapControl } from '../../../map-control/map-control';

export const addToPath = (m: string, co: Co, i: number) => {
	const { x, y } = MapControl.project(co);
	return `${ m }${ i ? 'L' : 'M' }${ x } ${ y }`;
};
