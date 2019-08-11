import * as mapboxgl from 'mapbox-gl';
import { dis } from '../../utils/util-point';
import { DOM } from '../../utils/util-dom';
import { coToLl } from '../../utils/util-geo';
import { EventEmitter } from '../../event-emitter';
import { getNearestVertex } from '../../reducers/fn/get-nearest-vertex';
import {
	currentCollectionId,
	currentFeatureCollection
} from '../../reducers/selectors/index.selectors';
import { getNearestPointOnGeometry } from '../../reducers/fn/get-nearest-point-on-geometry';
import {
	dispatch,
	getState } from '../../reducers/store';
import {
	Ev,
	Dict,
	Pt,
	LngLat,
	FeatureCollection } from '../../types';
import {
	MENU_MODE,
	THRESHOLD,
	UPDATE_MODE,
	NAVIGATION_MODE } from '../../constants';
import {
	ActionSelect,
	ActionSetCollection,
	ActionClearSelection,
	ActionDeleteSelection,
	ActionSetMapControlMode } from '../../reducers/actions/actions';
import { batchActions } from 'redux-batched-actions';

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

	_hit(lngLat: LngLat, point: Pt, featureCollection: FeatureCollection) {
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

	onWheel(e: Ev) {
		const pos = DOM.mousePos(this._el, e.originalEvent);
		const lngLat = this._map.unproject(pos);

		const delta = e.originalEvent.shiftKey
			? e.originalEvent.deltaY / 400
			: e.originalEvent.deltaY / 100;

		const tr = this._map.transform;

		tr.zoom = tr.zoom - delta;
		tr.setLocationAtPoint(lngLat, pos);

		// we need to do this to make the map re-render correctly
		this._map.fire('zoom');
		e.originalEvent.preventDefault();
	}

	onPointerUp(e: Ev) {
		dispatch(ActionSetMapControlMode.create({ mode: NAVIGATION_MODE }));
	}

	onPointerDown(e: Ev) {
		const { lngLat, point, originalEvent } = e;
		const multi = originalEvent.shiftKey;
		const state = getState();

		const collectionId = currentCollectionId(state);
		const featureCollection = currentFeatureCollection(state);
		const vector = this._hit(lngLat, point, featureCollection);

		if (vector != null) {
			dispatch(batchActions([
				ActionSetCollection.create({ collectionId }),
				ActionSelect.create({ vector, multi }),
				ActionSetMapControlMode.create({ mode: UPDATE_MODE })
			]));
			// dispatch(ActionShowPropertiesPanel.create({}));
			// MapControl.resize();
		}  else {
			if (!multi) {
				dispatch(ActionSetMapControlMode.create({ mode: NAVIGATION_MODE }));
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
		dispatch(ActionSetMapControlMode.create({ mode: MENU_MODE }));
	}

	onPointerLongPress(e: Ev) {
		dispatch(ActionSetMapControlMode.create({ mode: MENU_MODE }));
	}

	onEscapeKey() {
		this.cleanUp();
	}

	onDeleteKey() {
		dispatch(ActionDeleteSelection.create({}));
	}

	cleanUp() {
		dispatch(ActionClearSelection.create({}));
	}
}
