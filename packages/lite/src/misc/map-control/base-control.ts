import bind from 'autobind-decorator';
import mapboxGL from 'mapbox-gl';
import { DOM } from 'lite/utils/util-dom';
import { token } from 'lite/constants/token';
import { coToLl, llToCo } from 'lite/utils/util-geo';
import { disableInteractions } from 'lite/utils/util-map';
import {
	EMPTY_STYLE,
	DEFAULT_LOCATION } from 'lite/constants';
import {
	Co,
	Location, MapboxLayer, MapboxSource,
	MapboxStyle, Pt
} from 'se';
import { EventEmitter } from 'lite/misc/events/event-emitter';

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
export class BaseMapControl extends EventEmitter {
	protected readonly _map: any;

	constructor(props: Props = DEFAULT_PROPS) {
		super();

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
			container,
			fadeDuration: 0
		});

		// container was only in DOM to prevent mapbox css sniffer error
		DOM.remove(container);

		disableInteractions(this._map);

		this._map.on('styledata', this._onStyleDataLoaded);
	}

	protected _onStyleDataLoaded() {
		this.trigger('style-loaded');
	}

	destroy() {
		this._map.off('styledata', this._onStyleDataLoaded);
	}

	resize() {
		this._map.resize();
	}

	getContainer() {
		return this._map.getContainer();
	}

	setStyle(style: any) {
		this._map.setStyle(style);
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

	project(co: Co) {
		return this._map.project(coToLl(co));
	}

	unproject(p: Pt) {
		return llToCo(this._map.unproject(p));
	}

	addStyle(style: MapboxStyle) {
		const { sources, layers } = style;

		Object.keys(sources).forEach(key => this.addSource(key, sources[key]));
		layers.forEach(layer => this.addLayer(layer));
	}

	removeStyle(style: MapboxStyle) {
		const { sources, layers } = style;

		layers.forEach(layer => this.removeLayer(layer));
		Object.keys(sources).forEach(key => this.removeSource(key, sources[key]));
	}

	addSource(name: string, data: MapboxSource) {
		if (!this._map.getSource(name)) {
			this._map.addSource(name, data);
		}
	}

	addLayer(layer: MapboxLayer) {
		if (!this._map.getLayer(layer.id)) {
			this._map.addLayer(layer);
		}
	}

	removeSource(name: string, data: MapboxSource) {
		if (this._map.getSource(name)) {
			this._map.removeSource(name, data);
		}
	}

	removeLayer(layer: MapboxLayer) {
		if (this._map.getLayer(layer.id)) {
			this._map.removeLayer(layer);
		}
	}

	addImage(id: string, img: any) {
		this._map.addImage(id, img);
	}
}
