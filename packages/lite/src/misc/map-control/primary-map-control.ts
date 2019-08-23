import bind from 'autobind-decorator';
import mapboxGL from 'mapbox-gl';
import { token } from 'lite/constants/token';
import { clamp } from 'lite/utils/util-clamp';
import { MenuMode } from './modes/mode.menu';
import { getCenter } from 'lite/utils/util-get-center';
import { ModeUpdate } from './modes/mode.update';
import { getBounds } from 'lite/utils/util-get-bounds';
import { getTargetZoom } from 'lite/utils/util-get-target-zoom';
import { PointerDevice } from './devices/device.pointer';
import { DrawPointMode } from './modes/mode.draw-point';
import { KeyboardDevice } from './devices/device.keyboard';
import { ModeNavigation } from './modes/mode.navigation';
import { DrawCircleMode } from './modes/mode.draw-circle';
import { DrawSegmentedMode } from './modes/mode.draw-segmented';
import { DrawRectangleMode } from './modes/mode.draw-rectangle';
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
	geoUnproject } from 'lite/utils/util-geo';
import { BaseMapControl } from 'lite/misc/map-control/base-control';

const FIT_PADDING = 64;
const FIT_MIN_ZOOM = 14;
const FIT_MAX_ZOOM = 19;

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
export class PrimaryMapControl extends BaseMapControl {
	static instance: PrimaryMapControl;

	static create(props: Props) {
		return PrimaryMapControl.instance || new PrimaryMapControl(props);
	}

	static resize() {
		PrimaryMapControl.instance.resize();
	}

	static fitFeatures(features: Feature<Geometry>[]) {
		PrimaryMapControl.instance.bringInView(features);
	}

	static setLocation(location: Location) {
		PrimaryMapControl.instance.setLocation(location);
	}

	static getZoom() {
		return PrimaryMapControl.instance.getZoom();
	}

	static setZoom(zoom: number) {
		PrimaryMapControl.instance.setZoom(zoom);
	}

	static zoomIn() {
		PrimaryMapControl.instance.zoomIn();
	}

	static zoomOut() {
		PrimaryMapControl.instance.zoomOut();
	}

	static setBearing(bearing: number) {
		PrimaryMapControl.instance.setBearing(bearing);
	}

	static setPitch(pitch: number) {
		PrimaryMapControl.instance.setPitch(pitch);
	}

	static setStyle(style: any) {
		PrimaryMapControl.instance.setStyle(style);
	}

	static project(co: Co) {
		return PrimaryMapControl.instance.project(co);
	}

	static unproject(p: Pt) {
		return PrimaryMapControl.instance.unproject(p);
	}

	static getMetersPerPixel(co?: Co) {
		return PrimaryMapControl.instance.getMetersPerPixel(co);
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
		PrimaryMapControl.instance.persistMetrics();
	}

	static onMapZoom() {
		PrimaryMapControl.instance.persistMetrics();
	}

	static attachTo(e: any) {
		if (e) {
			e.appendChild(PrimaryMapControl.instance.getContainer());
			PrimaryMapControl.instance.resize();
		}
	}

	// private readonly _map: any;
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
		super(props);

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

		this._map.on('move', PrimaryMapControl.onMapMove);
		this._map.on('zoom', PrimaryMapControl.onMapZoom);

		PrimaryMapControl.instance = this;
	}

	destroy() {
		super.destroy();

		this._updateMode.destroy();
		this._pointerDevice.destroy();
		this._navigationMode.destroy();
		this._keyboardDevice.destroy();

		this._map.off('move', PrimaryMapControl.onMapMove);
		this._map.off('zoom', PrimaryMapControl.onMapZoom);
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
}
