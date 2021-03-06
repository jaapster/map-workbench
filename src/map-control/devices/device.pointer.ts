import bind from 'autobind-decorator';
import mapboxgl from 'mapbox-gl';
import { EventEmitter } from '../../event-emitter';
import { geoProject } from '../../utils/util-geo';
import { sub } from '../../utils/util-point';
import { LngLat } from '../../types';

let prev: any;

const toEvent = (e: any) => {
	const merc = geoProject(e.lngLat as LngLat);

	prev = {
		...e,
		merc,
		movement: prev
			? sub(merc, prev.merc)
			: { x: 0, y: 0 }
	};

	return prev;
};

@bind
export class PointerDevice extends EventEmitter {
    static create(map: mapboxgl.Map) {
        return new PointerDevice(map);
    }

	private _pointerDown = false;
	private _timeoutLongPress: any = null;
	private _timeoutDblClick: any = null;
	private _longPressSincePointerDown = false;
	private _movedSincePointerDown = false;

    constructor(map: any) {
        super();

		// map.on('click', this._onClick);

        map.on('mousedown', this._onMouseDown);
        map.on('mousemove', this._onMouseMove);
        map.on('mouseup', this._onMouseUp);

        map.on('touchstart', this._onTouchStart);
        map.on('touchmove', this._onTouchMove);
        map.on('touchend', this._onTouchEnd);

        map.on('wheel', this._onWheel);
        map.on('contextmenu', PointerDevice._onContextMenu);

		window.addEventListener('mouseup', this._reset);
		window.addEventListener('touchend', this._reset);
		window.addEventListener('blur', this._onBlur);
    }

	private static _onContextMenu(e: any) {
		e.originalEvent.preventDefault();
		e.originalEvent.stopPropagation();
	}

    private _reset() {
		this._pointerDown = false;
	}

    private _onPointerDown(e: any) {
		this.trigger('pointerdown', e);

		this._pointerDown = true;
		this._movedSincePointerDown = false;
		this._longPressSincePointerDown = false;
		this._setLongPressTimeout(e);

		e.originalEvent.preventDefault();
    }

    private _onPointerMove(e: any) {
		this.trigger('pointermove', e);

		if (this._pointerDown) {
			if (!this._movedSincePointerDown) {
				this.trigger('pointerdragstart', e);
				this._movedSincePointerDown = true;
			} else {
				this.trigger('pointerdragmove', e);
			}
		}

        this._clearLongPressTimeout();
    }

    private _onPointerUp(e: any) {
		this.trigger('pointerup', e);

        if (!this._longPressSincePointerDown) {
            this._clearLongPressTimeout();

            if (!this._movedSincePointerDown) {
				if (this._timeoutDblClick) {
					this._clearDblClickTimeout();
					this._onPointerDblClick(e);
				} else {
					this._setDblClickTimeout(e);
				}
			} else {
				this.trigger('pointerdragend', e);
			}
        }

		this._pointerDown = false;
    }

    private _onPointerClick(e: any) {
        this._clearDblClickTimeout();

        if (this._movedSincePointerDown) {
            return;
        }

        const { originalEvent: { button, ctrlKey } } = e;

        this.trigger(
			button === 2 || ctrlKey
				? 'pointeraltclick'
				: 'pointerclick'
		, e);
    }

    private _onPointerDblClick(e: any) {
        this.trigger('pointerdblclick', e);
    }

    private _onPointerLongPress(e: any) {
        this.trigger('pointerlongpress', e);

        this._pointerDown = false;
        this._longPressSincePointerDown = true;
    }

    private _onMouseDown(e: mapboxgl.MapMouseEvent) {
		e.originalEvent.preventDefault();

        this._onPointerDown(toEvent(e));
    }

    private _onMouseMove(e: mapboxgl.MapMouseEvent) {
        this._onPointerMove(toEvent(e));
    }

    private _onMouseUp(e: mapboxgl.MapMouseEvent | MouseEvent) {
        this._onPointerUp(toEvent(e));
    }

    private _onTouchStart(e: mapboxgl.MapTouchEvent) {
        this._onPointerDown(toEvent(e));
    }

    private _onTouchMove(e: mapboxgl.MapTouchEvent | TouchEvent) {
        this._onPointerMove(toEvent(e));
    }

    private _onTouchEnd(e: mapboxgl.MapTouchEvent | TouchEvent) {
        this._onPointerUp(toEvent(e));
    }

    private _onWheel(e: any) {
    	this.trigger('wheel', e);
    }

    private _onBlur() {
        this.trigger('blur');
    }

    private _setDblClickTimeout(e: mapboxgl.MapMouseEvent) {
        this._timeoutDblClick = setTimeout(() => this._onPointerClick(e), 220);
    }

    private _setLongPressTimeout(e: mapboxgl.MapMouseEvent) {
        this._timeoutLongPress = setTimeout(() => this._onPointerLongPress(e), 500);
    }

    private _clearDblClickTimeout() {
        clearTimeout(this._timeoutDblClick);

        this._timeoutDblClick = null;
    }

    private _clearLongPressTimeout() {
        clearTimeout(this._timeoutLongPress);

        this._timeoutLongPress = null;
    }
}
