import bind from 'autobind-decorator';
import { layers } from './draw-mode-layers';
import { toPairs } from '../../utils/util-to-pairs';
import { addAtIndex } from './add-at-index';
import { moveGeometry } from './move-geometry';
import { nearestVertex } from './nearest-vertex';
import { deleteAtIndex } from './delete-at-index';
import { multiPointToCircle } from '../../utils/util-multi-point-to-circle';
import { nearestPointOnGeometry } from './nearest-point-on-geometry';
import {
	lngLatToCo,
	coToLngLat } from '../../utils/util-lng-lat-to-co';
import {
	updateCoordinate,
	updateCoordinates } from './update-coordinate';
import {
	angle,
	rotateAround,
	nearestPointOnLine } from '../../utils/util-math';
import { InteractionMode } from '../interaction-mode';
import { Feature, FeatureCollection, MultiPoint } from '../../../../types';
import {
	EMPTY,
	POINT,
	CIRCLE,
	FEATURE,
	RECTANGLE,
	THRESHOLD,
	MODIFIERS,
	MULTI_POINT } from '../../../../services/constants';
import { data } from './draw-mode-dev-data';

@bind
export class DrawMode extends InteractionMode {
	static create(map: any) {
		return new	DrawMode(map);
	}

	constructor(map: any) {
		super(map);

		// @ts-ignore
		window.dumpData = i => this._data.features[i];
	}

	protected _onStyleLoaded() {
		this._map.addSource('draw', {
			type: 'geojson',
			data: {
				...this._data,
				features: this._data.features.map(this._roll)
			}
		} as any);

		this._map.addSource('draw-selected', {
			type: 'geojson',
			data: EMPTY
		} as any);

		layers.forEach(layer => this._map.addLayer(layer as any));

		this._render();
	}

	private _data: FeatureCollection = data;

	private _index: number[] = [];

	private _prevIndex: number | null = -1;

	private _project(a: any) {
		return this._map.project(a);
	}

	private _unproject(a: any) {
		return this._map.unproject(a);
	}

	private _roll(f: Feature<MultiPoint>) {
		return f.properties.type === CIRCLE
			? multiPointToCircle(f, this._project, this._unproject)
			: f;
	}

	private _render() {
		if (!this._index.length) {
			if (this._prevIndex !== null) {
				this._prevIndex = null;
				this._map.getSource('draw').setData({
					...this._data,
					features: this._data.features.map(this._roll)
				});
				this._map.getSource('draw-selected').setData(EMPTY);
			}
		} else {
			if (this._prevIndex !== this._index[0]) {
				this._prevIndex = this._index[0];
				this._map.getSource('draw').setData({
					...this._data,
					features: this._data.features.reduce((m1, f1, i) => (
						i !== this._index[0]
							? m1.concat(this._roll(f1))
							: m1
					), [])
				});
			}

			const { features } = this._data;
			const [_i, _j, _k, _l] = this._index;
			const { geometry: { type, coordinates } } = features[_i];

			this._map.getSource('draw-selected').setData({
				...this._data,
				features: [
					this._roll(features[_i])
				].concat({
						type: FEATURE,
						geometry: {
							type: MULTI_POINT,
							coordinates: (
								type === POINT
									? [coordinates]
									: toPairs((coordinates).flat(4))
							)
						},
						properties: {
							type: 'vertex'
						}
					}).concat(
						_j != null || type === POINT
							? {
								type: FEATURE,
								geometry: {
									type: POINT,
									coordinates:
										type === POINT
											? coordinates
											: _k == null
												? coordinates[_j]
												: _l == null
													? coordinates[_j][_k]
													: coordinates[_j][_k][_l]
								},
								properties: {
									type: 'selected-vertex'
								}
							}
							: []
					)
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
		if (e.originalEvent[MODIFIERS.ADD_VERTEX]) {
			const [f] = this._index;
			const { properties: { type } } = this._data.features[f];

			if (![RECTANGLE, CIRCLE].includes(type)) {
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
	}

	onPointerDragMove(e: any) {
		if (this._index.length) {
			const {
				lngLat,
				originalEvent: { movementX, movementY }
			} = e;

			if (this._index.length > 1) {
				// get the feature index
				const [f] = this._index;
				const {
					geometry: { coordinates },
					properties: { type }
				} = this._data.features[f];

				if (type === RECTANGLE) {
					// get the vertex index
					const [, , nv] = this._index;
					const [cos] = coordinates;

					// get the coordinate indices of the points
					// opposite, clockwise and counter clockwise from
					// the point that is dragged
					const n0 = [2, 3, 0, 1, 2][nv];
					const n1 = [1, 2, 3, 0, 1][nv];
					const n2 = [3, 0, 1, 2, 3][nv];

					// get screen positions for the coordinates
					const p0 = this._project(coToLngLat(cos[n0]));
					const p1 = this._project(coToLngLat(cos[n1]));
					const p2 = this._project(coToLngLat(cos[n2]));
					const p3 = this._project(coToLngLat(cos[nv]));
					const pv = this._project(lngLat);

					if (e.originalEvent[MODIFIERS.ROTATE]) {
						// Rotation:
						// get the rotation increment in radians
						// (bearing from "opposite" to stored coordinates
						// vs bearing from "opposite" to mouse position)
						const t = (angle(p0, pv) - angle(p0, p3));

						// rotate all points and unproject to lngLat
						const A = this._unproject(rotateAround(p1, p0, t));
						const B = this._unproject(rotateAround(p2, p0, t));
						const C = this._unproject(rotateAround(p3, p0, t));

						// update the coordinates in the feature collection
						this._data = updateCoordinates(
							this._data,
							[
								[[f, 0, n1], lngLatToCo(A)],
								[[f, 0, n2], lngLatToCo(B)],
								[[f, 0, nv], lngLatToCo(C)]
							]
						);
					} else {
						// Resizing:
						// get the new positions of the two neighbouring points
						// and unproject to lngLat
						const A = this._unproject(nearestPointOnLine(pv, [p1, p0]));
						const B = this._unproject(nearestPointOnLine(pv, [p2, p0]));

						// update the coordinates in the feature collection
						this._data = updateCoordinates(
							this._data,
							[
								[[f, 0, n1], lngLatToCo(A)],
								[[f, 0, n2], lngLatToCo(B)],
								[[f, 0, nv], lngLatToCo(lngLat)]
							]
						);
					}
				} else if (type === CIRCLE) {
					const [, nv] = this._index;

					// a circle is a multipoint with two coordinates:
					// 0 is the center and 1 a point on the circle
					if (nv === 1) {
						// move the point on the circle (implicitly
						// changing the radius)
						this._data = updateCoordinate(
							this._data,
							this._index,
							lngLatToCo(lngLat)
						);
					} else {
						// move the entire circle by moving the center point
						this._data = moveGeometry(
							this._data,
							this._index,
							movementX,
							movementY,
							this._project,
							this._unproject
						);
					}
				} else {
					// change one coordinate in de the feature collection
					// at vector "this._index"
					this._data = updateCoordinate(
						this._data,
						this._index,
						lngLatToCo(lngLat)
					);
				}
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
		super.onKeyUp(e);

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
