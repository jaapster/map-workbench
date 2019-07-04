import { Point } from 'mapbox-gl';
import bind from 'autobind-decorator';
import { InteractionMode } from './interaction-mode';
import { layers } from './navigation-mode-layers';
import { DOM } from '../utils/util-dom';
import { Feature } from '../../../types';
import { FEATURE_COLLECTION, EMPTY } from '../../../services/constants';

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

@bind
export class NavigationMode extends InteractionMode {
	private _box: HTMLElement | null = null;
	private _scr: HTMLElement | null = null;
	private _boxZoom = false;
	private _lastPos = new Point(0, 0);
	private _startPos = new Point(0, 0);
	private _frameId = null;
	private _selection = EMPTY;

	static create(map: any, options: Options = {}) {
		return new	NavigationMode(map, { ...OPTIONS, ...options });
	}

	protected _onStyleLoaded() {
		this._map.addSource('selection', { type: 'geojson', data: EMPTY });

		layers.forEach(layer => this._map.addLayer(layer));

		this._render();
	}

	private _render() {
		this._map.getSource('selection').setData(this._selection);
	}

	onPointerDragStart(e: any) {
		this._lastPos = e.point;
		this._startPos = e.point;
	}

	onPointerDragMove(e: any) {
		if (!this._frameId) {
			this._frameId = this._map._requestRenderFrame(() => {
				this._frameId = null;

				const { originalEvent: { shiftKey, ctrlKey } } = e;
				const { pitch, rotate, boxZoom } = this._options;

				const tr = this._map.transform;

				if (ctrlKey && (pitch || rotate)) {
					const bearingDiff = (this._lastPos.x - e.point.x) * 0.5;
					const pitchDiff = (this._lastPos.y - e.point.y) * -0.5;

					if (rotate) {
						tr.bearing = tr.bearing - bearingDiff;
					}

					if (pitch) {
						tr.pitch = tr.pitch - pitchDiff;
					}

					// we need to do this to make the map re-render correctly
					this._map.fire({ type: 'move' });
				} else if (this._boxZoom || (shiftKey && boxZoom)) {
					this._boxZoom = true;

					const bounds = this._map.getContainer().getBoundingClientRect();

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

					this._box.style.transform = `translate(${ minX }px, ${ minY }px)`;
					this._box.style.width = `${ maxX - minX }px`;
					this._box.style.height = `${ maxY - minY }px`;

					const screenAspect = bounds.width / bounds.height;
					const boxAspect = (maxX - minX) / (maxY - minY);

					if (screenAspect > boxAspect) {
						const g = ((maxY - minY) * screenAspect) - (maxX - minX);
						this._scr.style.height = `${ maxY - minY }px`;
						this._scr.style.width = `${ (maxY - minY) * screenAspect }px`;
						this._scr.style.marginLeft = `-${ g / 2 }px`;
						this._scr.style.marginTop = '-1px';
					} else {
						const g = ((maxX - minX) / screenAspect) - (maxY - minY);
						this._scr.style.width = `${ maxX - minX }px`;
						this._scr.style.height = `${ (maxX - minX) / screenAspect }px`;
						this._scr.style.marginTop = `-${ g / 2 }px`;
						this._scr.style.marginLeft = '-1px';
					}
				} else {
					tr.setLocationAtPoint(tr.pointLocation(this._lastPos), e.point);

					// we need to do this to make the map re-render correctly
					this._map.fire({ type: 'move' });
				}

				this._lastPos = e.point;
			})
		}
	}

	onPointerUp(e: any) {
		if (this._boxZoom && e.point) {
			this._map.fitScreenCoordinates(this._startPos, e.point, this._map.getBearing(), { linear: true });
			this.cleanUp();
		}
	}

	onPointerDblClick(e: any) {
		this._map.zoomTo(
			this._map.getZoom() + (e.originalEvent.shiftKey ? -1 : 1),
			{ around: e.lngLat },
			e
		);
	}

	onPointerClick(e: any) {
		const [feature]: Feature<any>[] = this._map.queryRenderedFeatures(e.point);

		if (feature) {
			this._selection = {
				type: FEATURE_COLLECTION,
				// @ts-ignore
				features: [feature]
			};

			this._render();
		}
	}

	onPointerLongPress(e: any) {
		console.log(e.lngLat); // remove me
	}

	onWheel(e: any) {
		const pos = DOM.mousePos(this._el, e.originalEvent);
		const lngLat = this._map.unproject(pos);

		const delta = e.originalEvent.shiftKey
			? e.originalEvent.deltaY / 400
			: e.originalEvent.deltaY / 100;

		const tr = this._map.transform;

		tr.zoom = tr.zoom - delta;
		tr.setLocationAtPoint(lngLat, pos);

		// we need to do this to make the map re-render correctly
		this._map.fire({ type: 'zoom' });

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
		}

		if (this._scr) {
			DOM.remove(this._scr);

			this._scr = null;
		}

		this._selection = EMPTY;

		this._render();
	}

	setOptions(options: Options) {
		this._options = { ...OPTIONS, ...options };
	}
}