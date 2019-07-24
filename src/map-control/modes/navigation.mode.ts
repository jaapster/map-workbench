import bind from 'autobind-decorator';
import * as mapboxgl from 'mapbox-gl';
import { Ev } from '../../types';
import { DOM } from '../utils/util-dom';
import { InteractionMode } from './interaction.mode';

interface Options {
	pitch?: boolean;
	rotate?: boolean;
	boxZoom?: boolean;
	wheelZoom?: boolean;
}

const OPTIONS: Options = {
	pitch: true,
	rotate: true,
	boxZoom: true,
	wheelZoom: true
};

const isAlt = (e: Ev) => {
	const { originalEvent: { ctrlKey, button, buttons } } = e;

	return ctrlKey || button === 2 || buttons === 2;
};

@bind
export class NavigationMode extends InteractionMode {
	private _box: HTMLElement | null = null;
	private _scr: HTMLElement | null = null;
	private _boxZoom = false;
	private _lastPos = { x: 0, y: 0 };
	private _startPos = { x: 0, y: 0 };
	private _frameId = null;

	static create(map: mapboxgl.Map, options: Options = {}) {
		return new	NavigationMode(map, { ...OPTIONS, ...options });
	}

	onPointerDragStart(e: Ev) {
		this._lastPos = e.point;
		this._startPos = e.point;
	}

	onPointerDragMove(e: Ev) {
		if (!this._frameId) {
			this._frameId = this._map._requestRenderFrame(() => {
				this._frameId = null;

				const { originalEvent: { shiftKey } } = e;
				const { pitch, rotate, boxZoom } = this._options;

				const tr = this._map.transform;

				if (isAlt(e) && (pitch || rotate)) {
					const bearingDiff = (this._lastPos.x - e.point.x) * 0.5;
					const pitchDiff = (this._lastPos.y - e.point.y) * -0.5;

					if (rotate) {
						tr.bearing = tr.bearing - bearingDiff;
					}

					if (pitch) {
						tr.pitch = tr.pitch - pitchDiff;
					}

					// we need to do this to make the map re-render correctly
					this._map.fire('move');
				} else if (this._boxZoom || (shiftKey && boxZoom)) {
					this._boxZoom = true;

					const bounds = this._map
						.getContainer()
						.getBoundingClientRect();

					if (!this._box) {
						this._box = DOM.create('div', 'box-zoom', this._el);
					}

					if (!this._scr) {
						this._scr = DOM.create('div', 'box-screen', this._box);
					}

					const pos = e.point;

					const minX = Math.min(this._startPos.x, pos.x);
					const maxX = Math.max(this._startPos.x, pos.x);
					const minY = Math.min(this._startPos.y, pos.y);
					const maxY = Math.max(this._startPos.y, pos.y);

					const dX = maxX - minX;
					const dY = maxY - minY;

					this._box.style.transform =
						`translate(${ minX }px, ${ minY }px)`;
					this._box.style.width = `${ dX }px`;
					this._box.style.height = `${ dY }px`;

					const screenAspect = bounds.width / bounds.height;
					const boxAspect = dX / dY;

					if (screenAspect > boxAspect) {
						const g = (dY * screenAspect) - dX;
						this._scr.style.height = `${ dY }px`;
						this._scr.style.width = `${ dY * screenAspect }px`;
						this._scr.style.marginLeft = `-${ g / 2 }px`;
						this._scr.style.marginTop = '-1px';
					} else {
						const g = (dX / screenAspect) - dY;
						this._scr.style.width = `${ dX }px`;
						this._scr.style.height = `${ dX / screenAspect }px`;
						this._scr.style.marginTop = `-${ g / 2 }px`;
						this._scr.style.marginLeft = '-1px';
					}
				} else {
					tr.setLocationAtPoint(
						tr.pointLocation(this._lastPos),
						e.point
					);

					// we need to do this to make the map re-render correctly
					this._map.fire('move');
				}

				this._lastPos = e.point;
			});
		}
	}

	onPointerUp(e: Ev) {
		if (this._boxZoom && e.point) {
			this._map.fitScreenCoordinates(
				this._startPos as mapboxgl.PointLike,
				e.point as mapboxgl.PointLike,
				this._map.getBearing(),
				{ linear: true }
			);
			this.cleanUp();
		}
	}

	onPointerDblClick(e: Ev) {
		this._map.zoomTo(
			this._map.getZoom() + (e.originalEvent.shiftKey ? -1 : 1),
			{ around: e.lngLat },
			e
		);
	}

	onWheel(e: Ev) {
		const pos = DOM.mousePos(this._el, e.originalEvent);
		const lngLat = this._map.unproject(pos);

		const delta = e.originalEvent.shiftKey
			? e.originalEvent.deltaY / 400
			: e.originalEvent.deltaY / 100;

		const tr = this._map.transform;

		tr.zoom = tr.zoom - delta;
		tr.setLocationAtPoint(lngLat, pos);

		// we need to do this to make the map re-render correctly
		this._map.fire('zoom');

		e.originalEvent.preventDefault();
	}

	onBlur() {
		this.cleanUp();
	}

	cleanUp() {
		this._boxZoom = false;

		if (this._box) {
			DOM.remove(this._box);

			this._box = null;
		} else {
			super.cleanUp();
		}

		if (this._scr) {
			DOM.remove(this._scr);

			this._scr = null;
		}
	}
}
