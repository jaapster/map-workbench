import bind from 'autobind-decorator';
import mapboxGL from 'mapbox-gl';
import { DOM } from './utils/util-dom';
import { token } from '../token';
import { clamp } from '../utils/util-clamp';
import { DrawMode } from './modes/mode.draw';
import { MenuMode } from './modes/mode.menu';
import { getCenter } from './utils/util-get-center';
import { getBounds } from './utils/util-geo-json';
import { ModeUpdate } from './modes/mode.update';
import { EventEmitter } from '../event-emitter';
import { PointerDevice } from './devices/device.pointer';
import { KeyboardDevice } from './devices/device.keyboard';
import { MessageService } from '../services/service.message';
import { ModeNavigation } from './modes/mode.navigation';
import { InteractionMode } from './modes/mode.interaction';
import { UniverseService } from '../services/service.universe';
import { FeatureCollection } from '../models/feature-collection/model.feature-collection';
import { disableInteractions } from './utils/util-map';
import {
	FEATURE,
	MENU_MODE,
	DRAW_MODE,
	PROJECTED,
	GEOGRAPHIC,
	EMPTY_STYLE,
	LINE_STRING,
	UPDATE_MODE,
	NAVIGATION_MODE,
	DEFAULT_LOCATION } from '../constants';
import {
	Co, EPSG,
	Ev,
	FeatureJSON,
	Location
} from '../types';
import {
	getEnvelope,
	getTargetZoom } from './utils/util-get-target-zoom';
import {
	llToCo,
	coToLl,
	geoProject,
	geoUnproject } from './utils/util-geo';

const FIT_PADDING = 64;
const FIT_MIN_ZOOM = 14;
const FIT_MAX_ZOOM = 16;
const GLOBAL_MAX_ZOOM = 24;

mapboxGL.accessToken = token;

interface Props {
	style?: any;
	location: Location;
}

const DEFAULT_PROPS: Props = {
	style: EMPTY_STYLE,
	location: DEFAULT_LOCATION
};

@bind
export class MapControl extends EventEmitter {
	static instance: MapControl;

	static create(props: Props) {
		return MapControl.instance || new MapControl(props);
	}

	static getContainer() {
		return MapControl.instance.getContainer();
	}

	static resize() {
		MapControl.instance.resize();
	}

	static fitFeatures(features: FeatureJSON<any>[]) {
		MapControl.instance.bringInView(features);
	}

	static setLocation(location: Location) {
		MapControl.instance.setLocation(location);
	}

	static getZoom() {
		return MapControl.instance.getZoom();
	}

	static setZoom(zoom: number) {
		MapControl.instance.setZoom(zoom);
	}

	static getCenter() {
		return MapControl.instance.getCenter();
	}

	static getCRS() {
		return MapControl.instance.getCRS();
	}

	static getMode() {
		return MapControl.instance.getMode();
	}

	static activateNavigationMode() {
		MapControl.instance.activateNavigationMode();
	}

	static activateDrawMode(suspended: boolean) {
		MapControl.instance.activateDrawMode(suspended);
	}

	static activateProjectedCRS() {
		MapControl.instance.activateProjectedCRS();
	}

	static activateGeographicCRS() {
		MapControl.instance.activateGeographicCRS();
	}

	static setStyle(style: any) {
		MapControl.instance.setStyle(style);
	}

	static project(co: Co) {
		return MapControl.instance.project(co);
	}

	static projectToCRS(co: Co) {
		return MapControl.instance.projectToCRS(co);
	}

	static onMapMove() {
		MessageService.trigger('update:center');
	}

	static onMapZoom() {
		MessageService.trigger('update:zoom');
	}

	private readonly _map: any;
	private readonly _menuMode: MenuMode;
	private readonly _drawMode: DrawMode;
	private readonly _updateMode: ModeUpdate;
	private readonly _pointerDevice: PointerDevice;
	private readonly _keyboardDevice: KeyboardDevice;
	private readonly _navigationMode: ModeNavigation;

	private _mode: InteractionMode;
	private _CRS = GEOGRAPHIC;

	constructor(props: Props = DEFAULT_PROPS) {
		super();

		// add missing props
		const {
			style,
			location
		} = { ...DEFAULT_PROPS, ...props };

		const { center, zoom } = location;
		const container = DOM.create('div', 'map-container', document.body);

		this._map = new mapboxGL.Map({
			zoom,
			style,
			center,
			maxZoom: GLOBAL_MAX_ZOOM,
			// temporarily attach container element to body to keep
			// mapbox from complaining about missing CSS file
			container,
			fadeDuration: 0
		});

		this._drawMode = DrawMode.create(this._map);
		this._drawMode.on('finish', this.activateNavigationMode);

		this._menuMode = MenuMode.create(this._map);
		this._menuMode.on('select', this._activateUpdateMode);
		this._menuMode.on('finish', this.activateNavigationMode);

		this._updateMode = ModeUpdate.create(this._map);
		this._updateMode.on('select', this._activateUpdateMode);
		this._updateMode.on('finish', this.activateNavigationMode);

		this._navigationMode = ModeNavigation.create(this._map);
		this._navigationMode.on('select', this._activateUpdateMode);

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

		this._map.on('move', MapControl.onMapMove);
		this._map.on('zoom', MapControl.onMapZoom);

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

	private _onModeContext() {
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

	private _activateUpdateMode(model: FeatureCollection) {
		this._mode = this._updateMode.setModel(model);

		MessageService.trigger('update:mode');
	}

	private _activateMenuMode() {
		this._mode = this._menuMode;

		MessageService.trigger('update:mode');
	}

	activateNavigationMode() {
		this._mode = this._navigationMode;

		MessageService.trigger('update:mode');
	}

	// todo: ehh .. "suspended"?
	activateDrawMode(suspended: boolean) {
		if (!suspended) {
			this._mode.onEscapeKey();
		}

		this._drawMode.setModel(UniverseService.getCurrentWorld().trails);
		this._mode = this._drawMode;

		MessageService.trigger('update:mode');
	}

	resize() {
		this._map.resize();
	}

	bringInView(features: FeatureJSON<any>[]) {
		if (!this.isInView(features)) {
			const { width, height } = this.getBoundingClientRect();

			this.setLocation({
				zoom: clamp(
					// subtract 1 from zoom for mapbox
					getTargetZoom(
						features,
						{
							width: width - FIT_PADDING * 2,
							height: height - FIT_PADDING * 2
						}
					) - 1,
					FIT_MIN_ZOOM,
					FIT_MAX_ZOOM
				),
				center: getCenter(features),
				epsg: GEOGRAPHIC
			});
		}
	}

	isInView(features: FeatureJSON<any>[]) {
		const featureBounds = getBounds({
			type: FEATURE,
			geometry: {
				type: LINE_STRING,
				coordinates: getEnvelope(features)
			},
			properties: {
				type: LINE_STRING,
				id: ''
			}
		});
		const currentZoom = this.getZoom(); // this._map.getZoom();

		// get current extent in pixels
		const { top: t, left: l, width, height } = this.getBoundingClientRect();

		const left = FIT_PADDING;
		const top = FIT_PADDING;
		const right = width - l - FIT_PADDING;
		const bottom = height - t - FIT_PADDING;

		// get geometry extent in pixels
		const [a, b] = featureBounds.map(this.project);

		return (
			a.x > left && a.x < right &&
			b.x > left && b.x < right &&
			a.y > top && a.y < bottom &&
			b.y > top && b.y < bottom &&
			currentZoom >= FIT_MIN_ZOOM && currentZoom <= FIT_MAX_ZOOM
		);
	}

	getContainer() {
		return this._map.getContainer();
	}

	setStyle(style: any) {
		this._map.setStyle(style);
	}

	setLocation(location: Location) {
		const { center: [x, y], zoom, epsg } = location;

		if (![GEOGRAPHIC, PROJECTED].includes(epsg)) {
			throw(new Error('invalid EPSG'));
		}

		const co = epsg === GEOGRAPHIC
			? [x, y]
			: llToCo(geoUnproject({ x, y }));

		this.setCenter(co as Co);
		this.setZoom(zoom);
	}

	getCenter() {
		return this.projectToCRS(llToCo(this._map.getCenter()));
	}

	// expects WGS84
	setCenter(co: Co) {
		this._map.setCenter(coToLl(co));
	}

	getZoom() {
		return this._map.getZoom() + 1;
	}

	setZoom(zoom: number) {
		this._map.setZoom(zoom - 1);
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

	// project to screen coordinates
	project(co: Co) {
		return this._map.project(coToLl(co));
	}

	getCRS() {
		return this._CRS;
	}

	setCRS(crs: EPSG) {
		this._CRS = crs;
	}

	activateGeographicCRS() {
		this._CRS = GEOGRAPHIC;

		MessageService.trigger('update:crs');
	}

	activateProjectedCRS() {
		this._CRS = PROJECTED;

		MessageService.trigger('update:crs');
	}

	// project GEOGRAPHIC to PROJECTED if needed
	projectToCRS(co: Co) {
		if (co == null) {
			return [0, 0];
		}

		if (this._CRS === GEOGRAPHIC) {
			return co;
		}

		const { x, y } = geoProject(coToLl(co));

		return [
			Math.round(x),
			Math.round(y)
		];
	}
}
