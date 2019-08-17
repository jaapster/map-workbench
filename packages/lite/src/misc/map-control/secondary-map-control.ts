import mapboxGL from 'mapbox-gl';
import { DOM } from 'lite/utils/util-dom';
import { token } from 'lite/constants/token';
import { coToLl } from 'lite/utils/util-geo';
import { dispatch } from 'lite/store/store';
import { ActionSetGlare } from 'lite/store/actions/actions';
import { KeyboardDevice } from './devices/device.keyboard';
import { disableInteractions } from 'lite/utils/util-map';
import {
	EMPTY_STYLE,
	DEFAULT_LOCATION } from 'lite/constants';
import {
	Co,
	Location,
	MapboxStyle } from 'se';

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

export class SecondaryMapControl {
	static instance: SecondaryMapControl;

	static create(props: Props) {
		return SecondaryMapControl.instance || new SecondaryMapControl(props);
	}

	static getContainer() {
		return SecondaryMapControl.instance.getContainer();
	}

	static resize() {
		SecondaryMapControl.instance.resize();
	}

	static setZoom(zoom: number) {
		SecondaryMapControl.instance.setZoom(zoom);
	}

	static setCenter(center: Co) {
		SecondaryMapControl.instance.setCenter(center);
	}

	static setStyle(style: any) {
		SecondaryMapControl.instance.setStyle(style);
	}

	static project(co: Co) {
		return SecondaryMapControl.instance.project(co);
	}

	static attachTo(e: any) {
		if (e) {
			e.appendChild(SecondaryMapControl.instance.getContainer());
			SecondaryMapControl.instance.resize();
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
			container,
			fadeDuration: 0
		});

		// container was only in DOM to prevent mapbox css sniffer error
		DOM.remove(container);

		this._keyboardDevice = KeyboardDevice.create();
		this._keyboardDevice.on('glareKeyDown', SecondaryMapControl.onGlareKeyDown);
		this._keyboardDevice.on('glareKeyUp', SecondaryMapControl.onGlareKeyUp);

		disableInteractions(this._map);

		SecondaryMapControl.instance = this;
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

	setZoom(zoom: number) {
		this._map.setZoom(zoom - 1);
	}

	project(co: Co) {
		return this._map.project(coToLl(co));
	}
}
