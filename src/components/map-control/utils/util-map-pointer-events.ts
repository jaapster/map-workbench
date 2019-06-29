import bind from 'autobind-decorator';
import { EventEmitter } from '../../../event-emitter';
import * as mapboxgl from 'mapbox-gl';

const log = (...args: any[]) => console.log(...args);

// @ts-ignore
const toEvent  = (e: mapboxgl.MapTouchEvent | mapboxgl.MapMouseEvent | TouchEvent | MouseEvent) => {
    return {
        ...e,
        // features: !(e instanceof TouchEvent || e instanceof MouseEvent)
		features: !(e instanceof MouseEvent)
			// @ts-ignore
			? e.target.queryRenderedFeatures(e.point)
			: []
    };
};

@bind
export class MapPointerEvents extends EventEmitter {
    static create(map: mapboxgl.Map) {
        return new MapPointerEvents(map);
    }

    constructor(map: any) {
        super();

        map.on('mousedown', this._onMouseDown);
        map.on('mousemove', this._onMouseMove);
        map.on('mouseup', this._onMouseUp);

        map.on('touchstart', this._onTouchStart);
        map.on('touchmove', this._onTouchMove);
        map.on('touchend', this._onTouchEnd);

        map.on('wheel', this._onWheel);

        // todo: add real handler for this
        map.on('contextmenu', (e: any) => e.originalEvent.preventDefault());

        // document.addEventListener('mouseup', this._onMouseUp);
		// document.addEventListener('touchend', this._onTouchEnd);

		window.addEventListener('blur', this._onBlur);
    }

    private _pointerDown = false;
    private _timeoutLongPress: any = null;
    private _timeoutDblClick: any = null;
    private _longPressSincePointerDown = false;
    private _movedSincePointerDown = false;

    private _onPointerDown(e: any) {
        // log('pointerdown');
		this.trigger('pointerdown', e);

		this._pointerDown = true;
        this._movedSincePointerDown = false;
        this._longPressSincePointerDown = false;
        this._setLongPressTimeout(e);
    }

    private _onPointerMove(e: any) {
        // log('pointermove', e);
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
        if (!this._longPressSincePointerDown) {
            // log('pointerup');
			this.trigger('pointerup', e);

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

        // log('pointerclick');
		this.trigger('pointerclick', e);
    }

    private _onPointerDblClick(e: any) {
        // log('pointerdblclick');
		this.trigger('pointerdblclick', e);
    }

    private _onPointerLongPress(e: any) {
        // log('pointerlongpress');
		this.trigger('pointerlongpress', e);

        this._longPressSincePointerDown = true;
    }

    private _onMouseDown(e: mapboxgl.MapMouseEvent) {
        // log('mousedown', e);
		e.originalEvent.preventDefault();

        this._onPointerDown(toEvent(e));
    }

    private _onMouseMove(e: mapboxgl.MapMouseEvent) {
        // log('mousemove', e);

        this._onPointerMove(toEvent(e));
    }

    private _onMouseUp(e: mapboxgl.MapMouseEvent | MouseEvent) {
        // log('mouseup', e);

        this._onPointerUp(toEvent(e));
    }

    private _onTouchStart(e: mapboxgl.MapTouchEvent) {
        // log('touchstart', e);

        this._onPointerDown(toEvent(e));
    }

    private _onTouchMove(e: mapboxgl.MapTouchEvent) {
        // log('touchmove', e);

        this._onPointerMove(toEvent(e));
    }

    private _onTouchEnd(e: mapboxgl.MapTouchEvent | TouchEvent) {
        // log('touchend', e);

        this._onPointerUp(toEvent(e));
    }

    private _onWheel(e: any) {
    	this.trigger('wheel', e);
	}

    private _onBlur() {
		this.trigger('blur');
	}

    private _setDblClickTimeout(e: mapboxgl.MapMouseEvent) {
        this._timeoutDblClick = setTimeout(() => this._onPointerClick(e), 250);
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
