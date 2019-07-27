import bind from 'autobind-decorator';
import * as mapboxgl from 'mapbox-gl';
import { InteractionMode } from './mode.interaction';

@bind
export class MenuMode extends InteractionMode {
	static create(map: mapboxgl.Map) {
		return new	MenuMode(map);
	}
}
