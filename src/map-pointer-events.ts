import bind from 'autobind-decorator';
import { EventEmitter } from './event-emitter';
import * as mapboxgl from 'mapbox-gl';

const log = (...args) => console.log(...args);

const toEvent  = (e: mapboxgl.MapTouchEvent | mapboxgl.MapMouseEvent) => {
    return {
        ...e,
        features: e.target.queryRenderedFeatures(e.point)
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

        map.on('dragstart', this._onDragStart);
        map.on('drag', this._onDragMove);
        map.on('dragend', this._onDragEnd);

        map.on('movestart', this._onMoveStart);
        map.on('move', this._onMove);
        map.on('moveend', this._onMoveEnd);
    }

    private _timeoutLongPress = null;
    private _timeoutDblClick = null;
    private _longPressSincePointerDown = false;
    private _movedSincePointerDown = false;

    private _onPointerDown(e) {
        log('pointerdown');

        this._movedSincePointerDown = false;
        this._longPressSincePointerDown = false;
        this._setLongPressTimeout(e);
    }

    private _onPointerMove(e) {
        // log('pointermove', e);
        this._movedSincePointerDown = true;

        this._clearLongPressTimeout();
    }

    private _onPointerUp(e) {
        if (!this._longPressSincePointerDown) {
            log('pointerup');

            this._clearLongPressTimeout();

            if (this._timeoutDblClick) {
                this._clearDblClickTimeout();
                this._onPointerDblClick(e);
            } else {
                this._setDblClickTimeout(e);
            }
        }
    }

    private _onPointerClick(e) {
        this._clearDblClickTimeout();

        if (this._movedSincePointerDown) {
            return;
        }

        log('pointerclick');
    }

    private _onPointerDblClick(e) {
        log('pointerdblclick');
    }

    private _onPointerLongPress(e) {
        log('pointerlongpress');

        this._longPressSincePointerDown = true;
    }

    private _onMouseDown(e: mapboxgl.MapMouseEvent) {
        // log('mousedown', e);

        this._onPointerDown(toEvent(e));
    }

    private _onMouseMove(e: mapboxgl.MapMouseEvent) {
        // log('mousemove', e);

        this._onPointerMove(toEvent(e));
    }

    private _onMouseUp(e: mapboxgl.MapMouseEvent) {
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

    private _onTouchEnd(e: mapboxgl.MapTouchEvent) {
        // log('touchend', e);

        this._onPointerUp(toEvent(e));
    }

    private _onDragStart(e) {
        // log('dragstart');
    }

    private _onDragMove(e) {
        // log('dragmove');
    }

    private _onDragEnd(e) {
        // log('dragend');
    }

    private _onMoveStart(e) {
        // log('movestart');
    }

    private _onMove(e) {
        // log('move');
    }

    private _onMoveEnd(e) {
        console.log(e); // remove me
        // log('moveend');
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
