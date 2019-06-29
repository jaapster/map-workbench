export class InteractionMode {
	readonly _el: any;
	readonly _map: any;
	readonly _container: any;

	_options: any;

	constructor(map: any, options?: any) {
		this._el = map.getCanvasContainer();
		this._map = map;
		this._options = options;
		this._container = map.getContainer();
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

	onStyleLoaded() {}

	reset() {}

	setOptions(options: any) {
		this._options = options;
	}
}
