import * as mapboxgl from 'mapbox-gl';
import { DOM } from '../../../utils/util-dom';
import { getHit } from '../../../utils/util-get-hit';
import { MapControl } from '../map-control';
import { batchActions } from 'redux-batched-actions';
import { EventEmitter } from '../../events/event-emitter';
import {
	currentCollectionId,
	currentFeatureCollection } from '../../../store/selectors/index.selectors';
import {
	dispatch,
	getState } from '../../../store/store';
import {
	Ev,
	Dict } from '../../../types';
import {
	MENU_MODE,
	UPDATE_MODE,
	NAVIGATION_MODE } from '../../../constants/constants';
import {
	ActionSelect,
	ActionSetCollection,
	ActionClearSelection,
	ActionDeleteSelection,
	ActionRequestSelection,
	ActionSetMapControlMode } from '../../../store/actions/actions';

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
		const vector = getHit(lngLat, point, featureCollection, MapControl);

		if (vector != null) {
			dispatch(batchActions([
				ActionSetCollection.create({ collectionId }),
				ActionSelect.create({ vector, multi }),
				ActionSetMapControlMode.create({ mode: UPDATE_MODE })
			]));
		} else {
			// axios.post('/api/v2/applications/0/projects/0/maps/0/selection', {
			// 	zoom: 10,
			// 	geometry: getSelectionBuffer(point)
			// }).then(res => console.log(res.data));

			dispatch(ActionRequestSelection.create({ point }));

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
