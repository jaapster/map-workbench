import bind from 'autobind-decorator';
import mapboxGL from 'mapbox-gl';
import { DOM } from './utils/util-dom';
import { sub } from './utils/util-point';
import { token } from '../token';
import { coToLl } from './utils/util-geo';
// import { llToCo } from './utils/util-geo';
import { DrawMode } from './modes/draw.mode';
import { getBounds } from './utils/util-geo-json';
import { UpdateMode } from './modes/update.mode';
import { EventEmitter } from '../event-emitter';
import { TrailService } from '../services/trail.service';
import { PointerDevice } from './devices/pointer.device';
import { KeyboardDevice } from './devices/keyboard.device';
import { NavigationMode } from './modes/navigation.mode';
import { InteractionMode } from './modes/interaction.mode';
import { FeatureCollectionModel } from '../models/feature-collection/feature-collection.model';
import {
	styles,
	disableInteractions } from './utils/util-map';
import {
	DRAW_MODE,
	UPDATE_MODE,
	NAVIGATION_MODE, MENU_MODE
} from '../constants';
import {
	Ev,
	// Bounds,
	// LngLat,
	Feature,
	Location, Co } from '../types';
import { MenuMode } from './modes/menu.mode';

const FIT_MIN_ZOOM = 14;
const FIT_MAX_ZOOM = 16;
const FIT_PADDING = 64;

// @ts-ignore
mapboxGL.accessToken = token;

interface Props {
	location: Location;
	style?: string;
}

const defaultProps: Props = {
	location: { center: [0, 0], zoom: 1 },
	style: styles[0][1]
};

@bind
export class MapControl extends EventEmitter {
	static instance: MapControl;

	static create(props: Props) {
		return MapControl.instance || new MapControl(props);
	}

	static resize() {
		MapControl.instance.resize();
	}

	static fitFeature(feature: Feature<any>) {
		MapControl.instance.fitFeature(feature);
	}

	static setLocation(location: Location) {
		MapControl.instance.setLocation(location);
	}

	// static getExtent() {
	// 	return MapControl.instance.getExtent();
	// }

	static project(co: Co) {
		return MapControl.instance.project(co);
	}

	// static getFeatureAt(lngLat: LngLat) {
	// 	return MapControl.instance.getFeatureAt(lngLat);
	// }

	private readonly _map: any;
	// private readonly _layers: FeatureCollectionLayer[];
	private readonly _menuMode: MenuMode;
	private readonly _drawMode: DrawMode;
	private readonly _updateMode: UpdateMode;
	private readonly _pointerDevice: PointerDevice;
	private readonly _keyboardDevice: KeyboardDevice;
	private readonly _navigationMode: NavigationMode;

	private _mode: InteractionMode;

	constructor(props: Props = defaultProps) {
		super();

		// add missing props
		const { location, style } = { ...defaultProps, ...props };

		const { center, zoom } = location;
		const container = DOM.create('div', 'map-container', document.body);

		this._map = new mapboxGL.Map({
			zoom,
			style,
			center,
			maxZoom: 24,
			// temporarily attach container element to body to keep
			// mapbox from complaining about missing CSS file
			container,
			fadeDuration: 0
		});

		this._drawMode = DrawMode.create(this._map);
		this._drawMode.on('finish', this.activateNavigationMode);

		this._updateMode = UpdateMode.create(this._map);
		this._updateMode.on('finish', this.activateNavigationMode);

		this._navigationMode = NavigationMode.create(this._map);
		this._navigationMode.on('select', this._activateUpdateMode);

		this._menuMode = MenuMode.create(this._map);
		this._menuMode.on('finish', this.activateNavigationMode);

		this._pointerDevice = PointerDevice.create(this._map);
		this._keyboardDevice = KeyboardDevice.create();

		this._drawMode.on('context', this._onModeContext);
		this._updateMode.on('context', this._onModeContext);
		this._navigationMode.on('context', this._onModeContext);

		this._pointerDevice.on('pointerup', this._onPointerUp);
		this._pointerDevice.on('pointerdown', this._onPointerDown);
		this._pointerDevice.on('pointermove', this._onPointerMove);

		this._pointerDevice.on('pointerdragend', this._onPointerDragEnd);
		this._pointerDevice.on('pointerdragmove', this._onPointerDragMove);
		this._pointerDevice.on('pointerdragstart', this._onPointerDragStart);

		this._pointerDevice.on('pointerclick', this._onPointerClick);
		this._pointerDevice.on('pointerdblclick', this._onPointerDblClick);
		this._pointerDevice.on('pointeraltclick', this._onPointerAltClick);
		this._pointerDevice.on('pointerlongpress', this._onPointerLongPress);

		this._pointerDevice.on('blur', this._onBlur);
		this._pointerDevice.on('wheel', this._onWheel);

		this._keyboardDevice.on('deleteKey', this._onDeleteKey);
		this._keyboardDevice.on('escapeKey', this._onEscapeKey);

		this._map.on('move', this._onMapMove);
		this._map.on('zoom', this._onMapZoom);

		document.addEventListener('keydown', this._onKeyDown);

		disableInteractions(this._map);

		MapControl.instance = this;

		this._mode = this._navigationMode;
	}

	destroy() {
		this._updateMode.destroy();
		this._pointerDevice.destroy();
		this._navigationMode.destroy();
		this._keyboardDevice.destroy();
	}

	private _onMapMove() {
		this.trigger('move');
	}

	private _onMapZoom() {
		this.trigger('zoom');
	}

	private _onModeContext(e: Ev) {
		this.trigger('context', e);

		this._activateMenuMode();
	}

	private _onPointerDown(e: Ev) {
		this._mode.onPointerDown(e);
	}

	private _onPointerMove(e: Ev) {
		this._mode.onPointerMove(e);
	}

	private _onPointerUp(e: Ev) {
		this._mode.onPointerUp(e);
	}

	private _onPointerDragStart(e: Ev) {
		this._mode.onPointerDragStart(e);
	}

	private _onPointerDragMove(e: Ev) {
		this._mode.onPointerDragMove(e);
	}

	private _onPointerDragEnd(e: Ev) {
		this._mode.onPointerDragEnd(e);
	}

	private _onPointerClick(e: Ev) {
		this._mode.onPointerClick(e);
	}

	private _onPointerAltClick(e: Ev) {
		this._mode.onPointerAltClick(e);
	}

	private _onPointerDblClick(e: Ev) {
		this._mode.onPointerDblClick(e);
	}

	private _onPointerLongPress(e: Ev) {
		this._mode.onPointerLongPress(e);
	}

	private _onBlur() {
		this._mode.onBlur();
	}

	private _onWheel(e: Ev) {
		this._mode.onWheel(e);
	}

	private _onDeleteKey() {
		this._mode.onDeleteKey();
	}

	private _onEscapeKey() {
		this._mode.onEscapeKey();
	}

	private _onKeyDown(e: any) {
		if (e.key === ' ') {
			if (this._mode instanceof DrawMode) {
				this.activateNavigationMode();
				document.addEventListener('keyup', this._onKeyUp);
			}
		}
	}

	private _onKeyUp() {
		this.activateDrawMode(true);
		document.removeEventListener('keyup', this._onKeyUp);
	}

	private _activateUpdateMode(model: FeatureCollectionModel) {
		this._mode = this._updateMode.setModel(model);

		this.trigger('modeChange', UPDATE_MODE);
	}

	private _activateMenuMode() {
		this._mode = this._menuMode;

		this.trigger('modeChange', MENU_MODE);
	}

	activateNavigationMode() {
		this._mode = this._navigationMode;

		this.trigger('modeChange', NAVIGATION_MODE);
	}

	activateDrawMode(suspended: boolean) {
		if (!suspended) {
			this._mode.onEscapeKey();
		}

		this._drawMode.setModel(TrailService.getModel());
		this._mode = this._drawMode;

		this.trigger('modeChange', DRAW_MODE);
	}

	resize() {
		this._map.resize();
	}

	setStyle(style: string) {
		this._map.setStyle(style);
	}

	setLocation(location: Location) {
		const { center, zoom } = location;

		this._map.setCenter(center);
		this._map.setZoom(zoom);
	}

	fitFeature(feature: Feature<any>) {
		const featureBounds = getBounds(feature);
		const currentZoom = this._map.getZoom();

		// get current extent in pixels
		const { top: t, left: l, width, height } = this.getBoundingClientRect();

		const left = FIT_PADDING;
		const top = FIT_PADDING;
		const right = width - l - FIT_PADDING;
		const bottom = height - t - FIT_PADDING;

		// get geometry extent in pixels
		const [a, b] = featureBounds.map(this.project);

		// do nothing if the geometry is withing th logical viewport and
		// the zoom level is within the allowed zoom-range for fitting
		if (
			a.x > left && a.x < right &&
			b.x > left && b.x < right &&
			a.y > top && a.y < bottom &&
			b.y > top && b.y < bottom &&
			currentZoom >= FIT_MIN_ZOOM && currentZoom <= FIT_MAX_ZOOM
		) {
			return;
		}

		const { x, y } = sub(b, a);

		const featureWidth = Math.abs(x);
		const featureHeight = Math.abs(y);

		const maxZoom = featureWidth < right && featureHeight < bottom
			? currentZoom >= FIT_MIN_ZOOM
				? currentZoom <= FIT_MAX_ZOOM
					? currentZoom
					: FIT_MAX_ZOOM
				: FIT_MIN_ZOOM
			: FIT_MAX_ZOOM;

		const options = {
			linear: true,
			maxZoom,
			padding: FIT_PADDING,
			duration: 500
		};

		this._map.fitBounds(featureBounds, options);
	}

	// getExtent(): Bounds {
	// 	const { width, height } = this.getBoundingClientRect();
	//
	// 	const a = this._map.unproject({ x: 0, y: height });
	// 	const b = this._map.unproject({ x: width, y: 0 });
	//
	// 	return [llToCo(a), llToCo(b)];
	// }

	// setExtent(extent: Bounds) {
	// 	const options = {
	// 		linear: true,
	// 		padding: 0,
	// 		duration: 3
	// 	};
	//
	// 	this._map.fitBounds(extent, options);
	// }

	getContainer() {
		return this._map.getContainer();
	}

	getCenter() {
		return this._map.getCenter();
	}

	getZoom() {
		return this._map.getZoom();
	}

	getMode() {
		return this._mode === this._navigationMode
			? NAVIGATION_MODE
			: this._mode === this._drawMode
				? DRAW_MODE
				: this._mode === this._menuMode
					? MENU_MODE
					: UPDATE_MODE;
	}

	getBoundingClientRect() {
		return this.getContainer().getBoundingClientRect();
	}

	// getFeatureAt(lngLat: LngLat) {
	// 	return this._map.queryRenderedFeatures(this._map.project(lngLat));
	// }

	project(co: Co) {
		return this._map.project(coToLl(co));
	}
}
