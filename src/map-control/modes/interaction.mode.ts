import * as mapboxgl from 'mapbox-gl';
import { Dict, Ev, LngLat, Point } from '../../types';
import { EventEmitter } from '../../event-emitter';
import { coToLl } from '../utils/util-geo';
import { dis } from '../utils/util-point';
import { THRESHOLD } from '../../constants';
import { TrailService } from '../../services/trail.service';
import { GeoNoteService } from '../../services/geo-note.service';
import { FeatureCollectionModel } from '../../models/feature-collection/feature-collection.model';

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

	_hitCollectionModel(lngLat: LngLat, point: Point, model: FeatureCollectionModel, add: boolean) {
		let res = false;

		const {
			index,
			coordinate
		} = model.getNearestVertex(lngLat);

		const p = this._map.project(coToLl(coordinate));
		const d = dis(point, p);

		if (d < THRESHOLD) {
			model.select(index, add);
			this.trigger('select', model);
			res = true;
		} else {
			const {
				index,
				coordinate
			} = model.getNearestPointOnGeometry(lngLat);

			const p = this._map.project(coToLl(coordinate));
			const d = dis(point, p);

			if (d < THRESHOLD) {
				model.select([index[0]], add);
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
		this.trigger('finish');
	}
	onPointerDown({ lngLat, point, originalEvent }: Ev) {
		const add = originalEvent.shiftKey;

		const trailHit = this._hitCollectionModel(lngLat, point, TrailService.getModel(), add);
		const geoNoteHit = this._hitCollectionModel(lngLat, point, GeoNoteService.getModel(), add);

		if (!add) {
			if (trailHit) {
				GeoNoteService.clearSelection();
			} else if (geoNoteHit) {
				TrailService.clearSelection();
			}
		}
	}
	onPointerMove(e: Ev) {}
	onPointerClick(e: Ev) {}
	onPointerDblClick(e: Ev) {}
	onPointerLongPress(e: Ev) {}
	onPointerDragStart(e: Ev) {}
	onPointerDragMove(e: Ev) {}
	onPointerDragEnd(e: Ev) {}
	onPointerAltClick(e: Ev) {}

	onEscapeKey() {
		this.cleanUp();
	}

	onDeleteKey() {
		TrailService.deleteSelection();
		GeoNoteService.deleteSelection();
	}

	cleanUp() {
		TrailService.clearSelection();
		GeoNoteService.clearSelection();
	}
}
