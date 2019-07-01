import { Dict } from '../../../types';

export class InteractionMode {
	readonly _el: any;
	readonly _map: any;
	readonly _container: any;

	_options: Dict<any>;

	constructor(map: any, options?: any) {
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
	onWheel(e: any) {}
	onPointerUp(e: any) {}
	onPointerDown(e: any) {}
	onPointerMove(e: any) {}
	onPointerClick(e: any) {}
	onPointerDblClick(e: any) {}
	onPointerLongPress(e: any) {}
	onPointerDragStart(e: any) {}
	onPointerDragMove(e: any) {}
	onPointerDragEnd(e: any) {}
	onKeyEscape(e: any) {}
	onKeyDelete(e: any) {}
	onKeyUp(e: any) {}
	onContext(e: any) {
		console.log(e.lngLat);
	}

	cleanUp() {}

	setOptions(options: Dict<any>) {
		this._options = options;
	}
}
