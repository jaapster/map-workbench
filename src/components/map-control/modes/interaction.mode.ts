import { Dict, Ev, LngLat, Point } from '../../../types';
import { EventEmitter } from '../../../event-emitter';
import { coToLl } from '../utils/util-geo';
import { dis } from '../utils/util-point';
import { THRESHOLD } from '../../../constants';
import { TrailService } from '../../../services/trail.service';
import * as mapboxgl from 'mapbox-gl';
import { GeoNoteService } from '../../../services/geo-note.service';
import { FeatureCollectionModel } from '../../../models/feature-collection/feature-collection.model';

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

	_hitCollectionModel(lngLat: LngLat, point: Point, model: FeatureCollectionModel) {
		let res = false;

		const {
			index,
			coordinate
		} = model.nearestVertex(lngLat);

		const p = this._map.project(coToLl(coordinate));
		const d = dis(point, p);

		if (d < THRESHOLD) {
			model.select(index);
			this.trigger('select', model);
			res = true;
		} else {
			const {
				index,
				coordinate
			} = model.nearestPointOnGeometry(lngLat);

			const p = this._map.project(coToLl(coordinate));
			const d = dis(point, p);

			if (d < THRESHOLD) {
				model.select([index[0]]);
				this.trigger('select', model);
				res = true;
			}
		}

		return res;
	}

	destroy() {
		this._map.off('style.load', this._onStyleLoaded);
	}

	onBlur() {}
	onWheel(e: Ev) {}
	onPointerUp(e: Ev) {
		setTimeout(() => this.trigger('finish'));
	}
	onPointerDown({ lngLat, point, originalEvent }: Ev) {
		const trails = TrailService.getModel();
		const geoNotes = GeoNoteService.getModel();

		const trailHit = this._hitCollectionModel(lngLat, point, trails);
		const geoNoteHit = this._hitCollectionModel(lngLat, point, geoNotes);

		if (!originalEvent.shiftKey) {
			if (trailHit) {
				geoNotes.cleanUp();
			} else if (geoNoteHit) {
				trails.cleanUp();
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
		this.cleanUp();
	}

	onDeleteKey() {
		TrailService.getModel().deleteAtIndex();
		GeoNoteService.getModel().deleteAtIndex();
	}

	cleanUp() {
		TrailService.getModel().cleanUp();
		GeoNoteService.getModel().cleanUp();
	}
}
