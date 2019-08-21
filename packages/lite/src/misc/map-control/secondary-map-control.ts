import bind from 'autobind-decorator';
import mapboxGL from 'mapbox-gl';
import { token } from 'lite/constants/token';
import { dispatch } from 'lite/store/store';
import { ActionSetGlare } from 'lite/store/actions/actions';
import { KeyboardDevice } from './devices/device.keyboard';
import { BaseMapControl } from 'lite/misc/map-control/base-control';
import {
	EMPTY_STYLE,
	DEFAULT_LOCATION } from 'lite/constants';
import {
	Co,
	Location } from 'se';

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
export class SecondaryMapControl extends BaseMapControl {
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

	private readonly _keyboardDevice: KeyboardDevice;

	constructor(props: Props = DEFAULT_PROPS) {
		super(props);

		this._keyboardDevice = KeyboardDevice.create();
		this._keyboardDevice.on('glareKeyDown', SecondaryMapControl.onGlareKeyDown);
		this._keyboardDevice.on('glareKeyUp', SecondaryMapControl.onGlareKeyUp);

		SecondaryMapControl.instance = this;
	}

	destroy() {
		super.destroy();
		this._keyboardDevice.destroy();
	}

	static onGlareKeyDown() {
		dispatch(ActionSetGlare.create({ glare: true }));
	}

	static onGlareKeyUp() {
		dispatch(ActionSetGlare.create({ glare: false }));
	}
}
