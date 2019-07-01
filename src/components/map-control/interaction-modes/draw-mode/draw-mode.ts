import bind from 'autobind-decorator';
import { oc } from 'ts-optchain';
import { data } from './draw-mode-dev-data';
import { layers } from './draw-mode-layers';
import { addAtIndex } from './add-at-index';
import { moveGeometry } from './move-geometry';
import { nearestVertex } from './nearest-vertex';
import { deleteAtIndex } from './delete-at-index';
import { updateCoordinate } from './update-coordinate';
import { getSelectedFeature } from './get-selected-feature';
import { nearestPointOnGeometry } from './nearest-point-on-geometry';
import { InteractionMode } from '../interaction-mode';
import { FeatureCollection, Co } from '../../../../types';
import { POINT, FEATURE, THRESHOLD } from '../../../../services/constants';

@bind
export class DrawMode extends InteractionMode {
	static create(map: any) {
		return new	DrawMode(map);
	}

	protected _onStyleLoaded() {
		this._map.addSource('draw', { type: 'geojson', data: this._data });
		layers.forEach(layer => this._map.addLayer(layer));
		this._render();
	}

	private _index: number[] = [];

	private _data: FeatureCollection = data;

	private _project(a: any) {
		return this._map.project(a);
	}

	private _unproject(a: any) {
		return this._map.unproject(a);
	}

	private _render() {
		if (!this._index.length) {
			this._map.getSource('draw').setData(this._data);
		} else {
			const { features } = this._data;
			const [_i, _j, _k, _l] = this._index;

			this._map.getSource('draw').setData({
					...this._data,
					features: features.map((feature, i) => (
							i !== _i
								? feature
								: {
									...feature,
									properties: {
										selected: true
									}
								}
						)).concat(
							_j == null
								? []
								: {
									type: FEATURE,
									geometry: {
										type: POINT,
										coordinates: _k == null
											? features[_i].geometry.coordinates[_j]
											: _l == null
												? (features[_i].geometry.coordinates as Co[][])[_j][_k]
												// todo: find out how to type this. Co[][][] gives an error
												: (features[_i].geometry.coordinates as any)[_j][_k][_l]
									},
									properties: {
										type: 'vertex'
									}
								})
				});
		}
	}

	onPointerDown(e: any) {
		const { distance, index } = nearestVertex(
			e.point,
			this._data,
			this._project
		);

		if (distance < THRESHOLD) {
			this._index = index;
		} else {
			const { distance, index } = nearestPointOnGeometry(
				e.point,
				this._data,
				this._project,
				this._unproject
			);

			this._index = distance < THRESHOLD ? [index[0]] : [];
		}

		this._render();
	}

	onPointerDragStart(e: any) {
		if (e.originalEvent.altKey) {
			const { coordinate, distance, index } = nearestPointOnGeometry(
				e.point,
				this._data,
				this._project,
				this._unproject
			);

			if (distance < THRESHOLD) {
				this._index = index;
				this._data = addAtIndex(
					this._data,
					this._index,
					coordinate
				);

				this._render();
			}
		}
	}

	onPointerDragMove(e: any) {
		if (this._index.length) {
			const { lngLat: { lng, lat }, originalEvent: { movementX, movementY } } = e;

			if (this._index.length > 1 || oc(getSelectedFeature(this._data)).geometry.type() === POINT) {
				this._data = updateCoordinate(
					this._data,
					this._index,
					[lng, lat]
				);
			} else {
				this._data = moveGeometry(
					this._data,
					this._index,
					movementX,
					movementY,
					this._project,
					this._unproject
				);
			}

			this._render();
		}
	}

	onKeyUp(e: any) {
		if (e.key === 'Backspace' && this._index.length) {
			this._data = deleteAtIndex(this._data, this._index);
			this._index = this._index.slice(0, this._index.length - 1);
			this._render();
		}
	}

	cleanUp() {
		this._index = [];
		this._render();
	}
}
