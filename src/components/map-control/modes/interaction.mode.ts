import { Dict, Ev } from '../../../types';
import { EventEmitter } from '../../../event-emitter';
import { coToLl } from '../utils/util-geo';
import { dis } from '../utils/util-point';
import { THRESHOLD } from '../../../constants';
import { TrailService } from '../../../services/trail.service';
import * as mapboxgl from 'mapbox-gl';

export class InteractionMode extends EventEmitter {
	protected readonly _el: HTMLElement;
	protected readonly _map: any;
	protected readonly _container: HTMLElement;
	protected readonly _options: Dict<any>;

	constructor(map: mapboxgl.Map, options: Dict<any> = {}) {
		super();

		this._el = map.getCanvasContainer();
		this._map = map;
		this._options = options;
		this._container = map.getContainer();

		this._map.on('style.load', this._onStyleLoaded);
	}

	protected _onStyleLoaded() {}

	destroy() {
		this._map.off('style.load', this._onStyleLoaded);
	}

	onBlur() {}
	onWheel(e: Ev) {}
	onPointerUp(e: Ev) {
		setTimeout(() => this.trigger('finish'));
	}
	onPointerDown({ lngLat, point }: Ev) {
		const trails = TrailService.getModel();

		const {
			index,
			coordinate
		} = trails.nearestVertex(lngLat);

		const p = this._map.project(coToLl(coordinate));
		const d = dis(point, p);

		if (d < THRESHOLD) {
			trails.index = index;
			this.trigger('select', trails);
		} else {
			const {
				index,
				coordinate
			} = trails.nearestPointOnGeometry(lngLat);

			const p = this._map.project(coToLl(coordinate));
			const d = dis(point, p);

			if (d < THRESHOLD) {
				trails.index = [index[0]];
				this.trigger('select', trails);
			}
		}
	}
	onPointerMove(e: Ev) {}
	onPointerClick(e: Ev) {}
	onPointerDblClick(e: Ev) {}
	onPointerLongPress(e: Ev) {
		console.log('long press'); // remove me
	}
	onPointerDragStart(e: Ev) {}
	onPointerDragMove(e: Ev) {}
	onPointerDragEnd(e: Ev) {}
	onContext(e: Ev) {}

	onEscapeKey() {
		TrailService.getModel().cleanUp();
	}

	onDeleteKey() {
		TrailService.getModel().deleteAtIndex();
	}

	engage() {}

	cleanUp() {
		TrailService.getModel().cleanUp();
	}
}
