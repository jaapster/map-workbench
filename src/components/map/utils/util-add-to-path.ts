import { Co } from '../../../types';
import { coToLl } from '../../../map-control/utils/util-geo';
import { MapControl } from '../../../map-control/map-control';

export const addToPath = (m: string, co: Co, i: number) => {
	const { x, y } = MapControl.project(coToLl(co));
	return `${ m }${ i ? 'L' : 'M' }${ x } ${ y }`;
};
