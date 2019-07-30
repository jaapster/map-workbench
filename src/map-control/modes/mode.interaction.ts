import * as mapboxgl from 'mapbox-gl';
import { dis } from '../utils/util-point';
import { coToLl } from '../utils/util-geo';
import { dispatch } from '../../reducers/store';
import { THRESHOLD } from '../../constants';
import { EventEmitter } from '../../event-emitter';
import { getNearestVertex } from '../../reducers/fn/get-nearest-vertex';
import { getFeatureCollection } from '../../reducers/selectors/index.selectors';
import { getNearestPointOnGeometry } from '../../reducers/fn/get-nearest-point-on-geometry';
import {
	Ev,
	Dict,
	Point,
	LngLat,
	FeatureCollectionData } from '../../types';
import {
	ActionSelect,
	ActionSetCollection,
	ActionClearSelection,
	ActionDeleteSelection } from '../../reducers/actions';

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

	_hit(lngLat: LngLat, point: Point, featureCollection: FeatureCollectionData) {
		const {
			index: i1,
			coordinate: co1
		} = getNearestVertex(lngLat, featureCollection);

		if (co1 === null) {
			return null;
		}

		const p1 = this._map.project(coToLl(co1));

		if (dis(point, p1) < THRESHOLD) {
			return i1;
		}

		const {
			index: i2,
			coordinate: co2
		} = getNearestPointOnGeometry(lngLat, featureCollection);

		if (co2 === null) {
			return null;
		}

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

		const featureCollections = getFeatureCollection('trails');

		const trailHit = this._hit(lngLat, point, featureCollections);

		if (trailHit != null) {
			dispatch(ActionSetCollection.create({
				collectionId: 'trails'
			}));

			dispatch(ActionSelect.create({
				collectionId: 'trails',
				vector: trailHit,
				multi: add
			}));

			this.trigger('select');
		}  else {
			if (!add) {
				this.trigger('finish');
			}
		}
	}
	onPointerMove(e: Ev) {}
	onPointerClick(e: Ev) {}
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
		dispatch(ActionDeleteSelection.create({ collectionId: 'trails' }));
	}

	cleanUp() {
		dispatch(ActionClearSelection.create({ collectionId: 'trails' }));
	}
}
