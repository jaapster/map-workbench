import { Dict } from '../../../types';
import { EventEmitter } from '../../../event-emitter';

export class InteractionMode extends EventEmitter {
	readonly _el: any;
	readonly _map: any;
	readonly _container: any;

	_options: Dict<any>;

	constructor(map: any, options?: any) {
		super();

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
	onContext(e: any) {}
	onKeyUp(e: any) {
		if (e.key === 'Escape') {
			this.onEscapeKey();
		}

		if (e.key === 'Backspace') {
			this.onDeleteKey();
		}
	}
	onEscapeKey() {
		this.cleanUp();
	}
	onDeleteKey() {}

	engage() {}

	cleanUp() {}

	setOptions(options: Dict<any>) {
		this._options = options;
	}
}