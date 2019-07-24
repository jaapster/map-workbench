import * as mapboxgl from 'mapbox-gl';
import { dis } from '../utils/util-point';
import { coToLl } from '../utils/util-geo';
import { THRESHOLD } from '../../constants';
import { EventEmitter } from '../../event-emitter';
import { TrailService } from '../../services/trail.service';
import { GeoNoteService } from '../../services/geo-note.service';
import { FeatureCollectionModel } from '../../models/feature-collection/feature-collection.model';
import {
	Ev,
	Dict,
	Point,
	LngLat } from '../../types';

// const isAlt = (e: Ev) => {
// 	const { originalEvent: { ctrlKey, button, buttons } } = e;
//
// 	return ctrlKey || button === 2 || buttons === 2;
// };

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

	_hit(lngLat: LngLat, point: Point, model: FeatureCollectionModel) {
		const {
			index: i1,
			coordinate: co1
		} = model.getNearestVertex(lngLat);

		const p1 = this._map.project(coToLl(co1));

		if (dis(point, p1) < THRESHOLD) {
			return i1;
		}

		const {
			index: i2,
			coordinate: co2
		} = model.getNearestPointOnGeometry(lngLat);

		const p2 = this._map.project(coToLl(co2));

		if (dis(point, p2) < THRESHOLD) {
			return [i2[0]];
		}

		return null;
	}

	destroy() {
		this._map.off('style.load', this._onStyleLoaded);
	}

	onBlur() {}
	onWheel(e: Ev) {}
	onPointerUp(e: Ev) {
		// this.trigger('finish');
	}
	onPointerDown(e: Ev) {
		// this.trigger('finish');
		const { lngLat, point, originalEvent } = e;
		const add = originalEvent.shiftKey;

		const trailModel = TrailService.getModel();
		const geoNotesModel = GeoNoteService.getModel();

		const trailHit = this._hit(lngLat, point, trailModel);
		const geoNoteHit = this._hit(lngLat, point, geoNotesModel);

		if (trailHit != null) {
			if (!add) {
				GeoNoteService.clearSelection();
			}
			trailModel.select(trailHit, add);
			this.trigger('select', trailModel);
		} else if (geoNoteHit != null) {
			if (!add) {
				TrailService.clearSelection();
			}
			geoNotesModel.select(geoNoteHit, add);
			this.trigger('select', geoNotesModel);
		} else {
			if (!add) {
				this.trigger('finish');
			}
		}
	}
	onPointerMove(e: Ev) {}
	onPointerClick(e: Ev) {
		// const { lngLat, point } = e;
		//
		// const trailHit = this._hit(lngLat, point, TrailService.getModel());
		// const geoNoteHit = this._hit(lngLat, point, GeoNoteService.getModel());
		//
		// if (trailHit == null && geoNoteHit == null) {
		// 	GeoNoteService.clearSelection();
		// 	TrailService.clearSelection();
		// }
	}
	onPointerDragEnd(e: Ev) {}
	onPointerDragMove(e: Ev) {}
	onPointerDblClick(e: Ev) {}
	onPointerDragStart(e: Ev) {}

	onPointerAltClick(e: Ev) {
		this.trigger('context');
	}

	onPointerLongPress(e: Ev) {
		this.trigger('context');
	}

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
