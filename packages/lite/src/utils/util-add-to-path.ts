import { Co } from 'se';
import { PrimaryMapControl } from '../misc/map-control/primary-map-control';

export const addToPath = (m: string, co: Co, i: number) => {
	const { x, y } = PrimaryMapControl.project(co);
	return `${ m }${ i ? 'L' : 'M' }${ x } ${ y }`;
};
