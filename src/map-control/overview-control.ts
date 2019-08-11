import mapboxGL from 'mapbox-gl';
import { DOM } from '../utils/util-dom';
import { token } from '../token';
import { coToLl } from '../utils/util-geo';
import { dispatch } from '../reducers/store';
import { ActionSetGlare } from '../reducers/actions/actions';
import { KeyboardDevice } from './devices/device.keyboard';
import { disableInteractions } from '../utils/util-map';
import {
	EMPTY_STYLE,
	DEFAULT_LOCATION } from '../constants';
import {
	Co,
	Location,
	MapboxStyle } from '../types';

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

export class OverviewControl {
	static instance: OverviewControl;

	static create(props: Props) {
		return OverviewControl.instance || new OverviewControl(props);
	}

	static getContainer() {
		return OverviewControl.instance.getContainer();
	}

	static resize() {
		OverviewControl.instance.resize();
	}

	static setZoom(zoom: number) {
		OverviewControl.instance.setZoom(zoom);
	}

	static zoomIn() {
		OverviewControl.instance.zoomIn();
	}

	static zoomOut() {
		OverviewControl.instance.zoomOut();
	}

	static setCenter(center: Co) {
		OverviewControl.instance.setCenter(center);
	}

	static setBearing(bearing: number) {
		OverviewControl.instance.setBearing(bearing);
	}

	static setPitch(pitch: number) {
		OverviewControl.instance.setPitch(pitch);
	}

	static setStyle(style: any) {
		OverviewControl.instance.setStyle(style);
	}

	static project(co: Co) {
		return OverviewControl.instance.project(co);
	}

	static attachTo(e: any) {
		if (e) {
			e.appendChild(OverviewControl.instance.getContainer());
			OverviewControl.instance.resize();
		}
	}

	private readonly _map: any;
	private readonly _keyboardDevice: KeyboardDevice;

	private _style: string | MapboxStyle;

	constructor(props: Props = DEFAULT_PROPS) {
		// add missing universeData
		const {
			style,
			location
		} = { ...DEFAULT_PROPS, ...props };

		const { center, zoom } = location;
		const container = DOM.create('div', 'map-container', document.body);

		this._style = style;

		this._map = new mapboxGL.Map({
			zoom,
			style,
			center,
			maxZoom: GLOBAL_MAX_ZOOM - 1,
			// temporarily attach container element to body to keep
			// mapbox from complaining about missing CSS file
			container,
			fadeDuration: 0
		});

		// container was only in DOM to prevent mapbox css sniffer error
		DOM.remove(container);

		this._keyboardDevice = KeyboardDevice.create();
		this._keyboardDevice.on('glareKeyDown', OverviewControl.onGlareKeyDown);
		this._keyboardDevice.on('glareKeyUp', OverviewControl.onGlareKeyUp);

		disableInteractions(this._map);

		OverviewControl.instance = this;
	}

	destroy() {
		this._keyboardDevice.destroy();
	}

	static onGlareKeyDown() {
		dispatch(ActionSetGlare.create({ glare: true }));
	}

	static onGlareKeyUp() {
		dispatch(ActionSetGlare.create({ glare: false }));
	}

	resize() {
		this._map.resize();
	}

	getContainer() {
		return this._map.getContainer();
	}

	setStyle(style: any) {
		this._style = style;
		this._map.setStyle(style);
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

	setBearing(bearing: number) {
		this._map.setBearing(bearing);
	}

	setPitch(pitch: number) {
		return this._map.setPitch(pitch);
	}

	project(co: Co) {
		return this._map.project(coToLl(co));
	}
}
