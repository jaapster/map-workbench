import bind from 'autobind-decorator';
import mapboxGL from 'mapbox-gl';
import { DOM } from 'lite/utils/util-dom';
import { add } from 'lite/utils/util-point';
import { token } from 'lite/constants/token';
import { clamp } from 'lite/utils/util-clamp';
import { MenuMode } from './modes/mode.menu';
import { getCenter } from 'lite/utils/util-get-center';
import { ModeUpdate } from './modes/mode.update';
import { getBounds } from 'lite/utils/util-get-bounds';
import { newPolygon } from 'lite/utils/util-geo-json';
import { getTargetZoom } from 'lite/utils/util-get-target-zoom';
import { PointerDevice } from './devices/device.pointer';
import { DrawPointMode } from './modes/mode.draw-point';
import { KeyboardDevice } from './devices/device.keyboard';
import { ModeNavigation } from './modes/mode.navigation';
import { DrawCircleMode } from './modes/mode.draw-circle';
import { DrawSegmentedMode } from './modes/mode.draw-segmented';
import { DrawRectangleMode } from './modes/mode.draw-rectangle';
import { disableInteractions } from 'lite/utils/util-map';
import { ActionSetMapControlMetrics } from 'lite/store/actions/actions';
import {
	dispatch,
	getState } from 'lite/store/store';
import {
	PROJECTED,
	GEOGRAPHIC,
	EMPTY_STYLE,
	UPDATE_MODE,
	NAVIGATION_MODE,
	DEFAULT_LOCATION,
	DRAW_POINT_MODE,
	DRAW_CIRCLE_MODE,
	DRAW_SEGMENTED_MODE,
	DRAW_RECTANGLE_MODE } from 'lite/constants';
import {
	Pt,
	Co,
	Ev,
	EPSG,
	Polygon,
	Feature,
	Geometry,
	Location } from 'se';
import {
	llToCo,
	coToLl,
	geoProject,
	geoDistance,
	geoUnproject } from 'lite/utils/util-geo';

const FIT_PADDING = 64;
const FIT_MIN_ZOOM = 14;
const FIT_MAX_ZOOM = 19;
const GLOBAL_MAX_ZOOM = 20;

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
export class MapControl {
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

	static fitFeatures(features: Feature<Geometry>[]) {
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

	static zoomIn() {
		MapControl.instance.zoomIn();
	}

	static zoomOut() {
		MapControl.instance.zoomOut();
	}

	static setBearing(bearing: number) {
		MapControl.instance.setBearing(bearing);
	}

	static setPitch(pitch: number) {
		MapControl.instance.setPitch(pitch);
	}

	static setStyle(style: any) {
		MapControl.instance.setStyle(style);
	}

	static project(co: Co) {
		return MapControl.instance.project(co);
	}

	static unproject(p: Pt) {
		return MapControl.instance.unproject(p);
	}

	static getMetersPerPixel(co?: Co) {
		return MapControl.instance.getMetersPerPixel(co);
	}

	static projectToCRS(co: Co, CRS: EPSG) {
		if (co == null) {
			return null;
		}

		if (CRS === GEOGRAPHIC) {
			return co;
		}

		const { x, y } = geoProject(coToLl(co));

		return [
			Math.round(x),
			Math.round(y)
		] as Co;
	}

	static onMapMove() {
		MapControl.instance.persistMetrics();
	}

	static onMapZoom() {
		MapControl.instance.persistMetrics();
	}

	static attachTo(e: any) {
		if (e) {
			e.appendChild(MapControl.instance.getContainer());
			MapControl.instance.resize();
		}
	}

	private readonly _map: any;
	private readonly _menuMode: MenuMode;
	private readonly _updateMode: ModeUpdate;
	private readonly _pointerDevice: PointerDevice;
	private readonly _drawPointMode: DrawPointMode;
	private readonly _drawCircleMode: DrawCircleMode;
	private readonly _keyboardDevice: KeyboardDevice;
	private readonly _navigationMode: ModeNavigation;
	private readonly _drawRectangleMode: DrawRectangleMode;
	private readonly _drawSegmentedMode: DrawSegmentedMode;

	private _mouse: Co = [0, 0];

	constructor(props: Props = DEFAULT_PROPS) {
		// add missing universeData
		const {
			style,
			location
		} = { ...DEFAULT_PROPS, ...props };

		const { center, zoom } = location;
		const container = DOM.create('div', 'map-container', document.body);

		this._map = new mapboxGL.Map({
			zoom: zoom - 1,
			style,
			center,
			maxZoom: GLOBAL_MAX_ZOOM - 1,
			// temporarily attach container element to body to keep
			// mapbox from complaining about missing CSS file
			container,
			fadeDuration: 0
		});

		this.persistMetrics();

		this._drawPointMode = DrawPointMode.create(this._map);
		this._drawCircleMode = DrawCircleMode.create(this._map);
		this._drawRectangleMode = DrawRectangleMode.create(this._map);
		this._drawSegmentedMode = DrawSegmentedMode.create(this._map);
		this._menuMode = MenuMode.create(this._map);
		this._updateMode = ModeUpdate.create(this._map);
		this._navigationMode = ModeNavigation.create(this._map);

		this._pointerDevice = PointerDevice.create(this._map);
		this._keyboardDevice = KeyboardDevice.create();

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

		this._keyboardDevice.on('deleteKeyDown', this._onDeleteKey);
		this._keyboardDevice.on('escapeKeyDown', this._onEscapeKey);

		this._map.on('move', MapControl.onMapMove);
		this._map.on('zoom', MapControl.onMapZoom);

		disableInteractions(this._map);

		MapControl.instance = this;
	}

	destroy() {
		this._updateMode.destroy();
		this._pointerDevice.destroy();
		this._navigationMode.destroy();
		this._keyboardDevice.destroy();
	}

	private _mode() {
		const mode = getState().mapControl.mode;

		return mode === NAVIGATION_MODE
			? this._navigationMode
			: mode === DRAW_SEGMENTED_MODE
				? this._drawSegmentedMode
				: mode === DRAW_POINT_MODE
					? this._drawPointMode
					: mode === DRAW_CIRCLE_MODE
						? this._drawCircleMode
						: mode === DRAW_RECTANGLE_MODE
							? this._drawRectangleMode
							: mode === UPDATE_MODE
								? this._updateMode
								: this._menuMode;
	}

	private _onPointerDown(e: Ev) {
		this._mode().onPointerDown(e);
	}

	private _onPointerMove(e: Ev) {
		this._mode().onPointerMove(e);
		this._mouse = llToCo(e.lngLat);
		this.persistMetrics();
	}

	private _onPointerUp(e: Ev) {
		this._mode().onPointerUp(e);
	}

	private _onPointerDragStart(e: Ev) {
		this._mode().onPointerDragStart(e);
	}

	private _onPointerDragMove(e: Ev) {
		this._mode().onPointerDragMove(e);
	}

	private _onPointerDragEnd(e: Ev) {
		this._mode().onPointerDragEnd(e);
	}

	private _onPointerClick(e: Ev) {
		this._mode().onPointerClick(e);
	}

	private _onPointerAltClick(e: Ev) {
		this._mode().onPointerAltClick(e);
	}

	private _onPointerDblClick(e: Ev) {
		this._mode().onPointerDblClick(e);
	}

	private _onPointerLongPress(e: Ev) {
		this._mode().onPointerLongPress(e);
	}

	private _onBlur() {
		this._mode().onBlur();
	}

	private _onWheel(e: Ev) {
		this._mode().onWheel(e);
	}

	private _onDeleteKey() {
		this._mode().onDeleteKey();
	}

	private _onEscapeKey() {
		this._mode().onEscapeKey();
	}

	persistMetrics() {
		dispatch(ActionSetMapControlMetrics.create({
			zoom: this.getZoom(),
			pitch: this.getPitch(),
			mouse: this._mouse,
			center: this.getCenter(),
			extent: this.getExtent(),
			bearing: this.getBearing()
		}));
	}

	resize() {
		this._map.resize();
	}

	bringInView(features: Feature<Geometry>[]) {
		if (!this.isInView(features)) {
			const { width, height } = this.getBoundingClientRect();

			this.setLocation({
				zoom: clamp(
					getTargetZoom(
						features,
						{
							width: width - FIT_PADDING * 2,
							height: height - FIT_PADDING * 2
						}
					),
					FIT_MIN_ZOOM,
					FIT_MAX_ZOOM
				),
				center: getCenter(features),
				epsg: GEOGRAPHIC
			});
		}
	}

	isInView(features: Feature<Geometry>[]) {
		const currentZoom = this.getZoom();

		// get current extent in pixels
		const { top, left, width, height } = this.getBoundingClientRect();

		const l = FIT_PADDING;
		const t = FIT_PADDING;
		const r = width - left - FIT_PADDING;
		const bt = height - top - FIT_PADDING;

		// get geometry extent in pixels
		const [a, b] = getBounds(features).map(this.project);

		return (
			a.x > l && a.x < r &&
			b.x > l && b.x < r &&
			a.y > t && a.y < bt &&
			b.y > t && b.y < bt &&
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
		return llToCo(this._map.getCenter());
	}

	setCenter(co: Co) {
		this._map.setCenter(coToLl(co));
	}

	getZoom() {
		return this._map.getZoom() + 1;
	}

	setZoom(zoom: number) {
		this._map.setZoom(zoom - 1);
	}

	zoomIn() {
		this.setZoom(Math.round(this.getZoom() + 1));
	}

	zoomOut() {
		this.setZoom(Math.round(this.getZoom() - 1));
	}

	getBearing() {
		return this._map.getBearing();
	}

	setBearing(bearing: number) {
		this._map.setBearing(bearing);
	}

	getPitch() {
		return this._map.getPitch();
	}

	setPitch(pitch: number) {
		return this._map.setPitch(pitch);
	}

	getExtent(): Feature<Polygon> {
		const { width, height } = this.getBoundingClientRect();
		const p = 0;

		const c1 = this.unproject({ x: p, y: p });
		const c2 = this.unproject({ x: width - p, y: p });
		const c3 = this.unproject({ x: width - p, y: height - p });
		const c4 = this.unproject({ x: p, y: height - p });

		return newPolygon([[c1, c2, c3, c4, c1]]);
	}

	getBoundingClientRect() {
		return this.getContainer().getBoundingClientRect();
	}

	project(co: Co) {
		return this._map.project(coToLl(co));
	}

	unproject(p: Pt) {
		return llToCo(this._map.unproject(p));
	}

	getMetersPerPixel(co?: Co) {
		const center = co || this.getCenter();

		return geoDistance(
			center,
			MapControl.unproject(add(MapControl.project(center), { x: 1, y: 0 }))
		);
	}
}
