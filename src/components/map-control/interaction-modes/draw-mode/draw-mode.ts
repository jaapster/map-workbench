import bind from 'autobind-decorator';
import { data } from './draw-mode-dev-data';
import { layers } from './draw-mode-layers';
import { toPairs } from '../../utils/util-to-pairs';
import { realise } from './realise-features';
import { addAtIndex } from './add-at-index';
import { moveGeometry } from './move-geometry';
import { pointAtLength } from './point-at-length';
import { nearestVertex } from './nearest-vertex';
import { deleteAtIndex } from './delete-at-index';
import { InteractionMode } from '../interaction-mode';
import { analyseRectangle } from './analyse-rectangle';
import { updateCoordinates } from './update-coordinate';
import { nearestPointOnLine } from '../../utils/util-math';
import { setPropertyAtIndex } from './set-property-at-index';
import { nearestPointOnGeometry } from './nearest-point-on-geometry';
import {
	ang,
	dis,
	rot } from '../../utils/util-point';
import {
	coToLngLat,
	lngLatToCo } from '../../utils/util-lng-lat-to-co';
import {
	geoDis,
	geoUnproject } from '../../utils/util-geo';
import {
	Co,
	Point,
	Feature,
	LineString,
	FeatureCollection
} from '../../../../types';
import {
	POINT,
	EMPTY,
	CIRCLE,
	SEGMENT,
	FEATURE,
	POLYGON,
	THRESHOLD,
	RECTANGLE,
	PRECISION,
	MODIFIERS,
	LINE_STRING,
	MULTI_POINT,
	MULTI_POLYGON,
	MULTI_LINE_STRING
} from '../../../../services/constants';

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
			data: EMPTY
		} as any);

		this._map.addSource('draw-selected', {
			type: 'geojson',
			data: EMPTY
		} as any);

		layers.forEach(layer => this._map.addLayer(layer as any));

		this._render(true);
	}

	private _data: FeatureCollection = data;

	private _index: number[] = [];

	private _prevIndex: number | null = -1;

	private _screenProject(a: any) {
		return this._map.project(a);
	}

	private _screenUnproject(a: any) {
		return this._map.unproject(a);
	}

	private _render(forceDrawNonSelected: boolean = false) {
		if (this._prevIndex !== this._index[0] || forceDrawNonSelected) {
			this._prevIndex = this._index[0];

			this._map.getSource('draw').setData({
				...this._data,
				features: this._data.features.reduce((m1, f1, i) => (
					i !== this._index[0]
						? m1.concat(realise([f1]))
						: m1
				), [])
			});
		}

		if (this._index.length) {
			const { features } = this._data;
			const [_i, _j, _k, _l] = this._index;
			const l = this._index.length;
			const { geometry: { type, coordinates } } = features[_i];

			this._map.getSource('draw-selected').setData({
				...this._data,
				features: ([] as Feature<any>[])
					.concat(
						realise([features[_i]])
					)
					.concat([
						{
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
						}
					])
					.concat(
						this._index.length
							? [{
								type: FEATURE,
								geometry: {
									type: POINT,
									coordinates:
										l === 1
											? coordinates
											: l === 2
												? coordinates[_j]
												: l === 3
													? coordinates[_j][_k]
													: coordinates[_j][_k][_l]
								},
								properties: {
									type: 'selected-vertex'
								}
							}]
							: []
					)
					.concat(
						(
							type === LINE_STRING
								? [coordinates]
								: type === MULTI_LINE_STRING || type === POLYGON
									? coordinates
									: type === MULTI_POLYGON
										? coordinates.flat(1)
										: []
						)
						.reduce((m1: any, co1: Co[]) => (
							co1.reduce((
								m2: Feature<LineString>[],
								co2: Co,
								j: number,
								xs: Co[]
							) => (
								j === 0
									? m2
									: m2.concat({
										type: FEATURE,
										geometry: {
											type: LINE_STRING,
											coordinates: [xs[j - 1], co2]
										},
										properties: {
											type: SEGMENT,
											text: `${
												geoDis(
													coToLngLat(xs[j - 1]), 
													coToLngLat(co2)
												).toFixed(PRECISION)
											}`
										}
									})
							), m1)
						), [] as Feature<LineString>[])
					)
			});
		} else {
			this._map.getSource('draw-selected').setData(EMPTY);
		}
	}

	onPointerDown(e: any) {
		const { distance, index } = nearestVertex(
			e.point,
			this._data,
			this._screenProject
		);

		if (distance < THRESHOLD) {
			this._index = index;
		} else {
			const { distance, index } = nearestPointOnGeometry(
				e.point,
				this._data,
				this._screenProject,
				this._screenUnproject
			);

			this._index = distance < THRESHOLD ? [index[0]] : [];
		}

		this._render();
	}

	onPointerDragStart(e: any) {
		const [_i, , _k] = this._index;

		if (_i != null) {
			const {
				geometry: { coordinates },
				properties: { type }
			} = this._data.features[_i];

			if (e.originalEvent[MODIFIERS.ADD_VERTEX]) {
				if (![RECTANGLE, CIRCLE].includes(type)) {
					const {
						coordinate,
						distance,
						index
					} = nearestPointOnGeometry(
						e.point,
						this._data,
						this._screenProject,
						this._screenUnproject
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

			if (type === RECTANGLE && _k != null) {
				const { p0, p1, p2 } = analyseRectangle(coordinates, _k);

				this._data = setPropertyAtIndex(
					this._data,
					_i,
					'ratio',
					dis(p0, p1) / dis(p0, p2)
				);
			}
		}
	}

	onPointerDragMove(e: any) {
		const [_i, _j, _k] = this._index;

		if (_i != null) {
			const { merc, lngLat, movement } = e;

			if (_j != null) {
				// the index contains more than just the feature index
				// so we're going to update one or more coordinates
				// in its geometry
				const {
					geometry: { coordinates },
					properties: { type },
					properties
				} = this._data.features[_i];

				if (type === RECTANGLE) {
					const { p0, p1, p2, p3, n1, n2 } = analyseRectangle(
						coordinates,
						_k
					);

					let A: Point;
					let B: Point;
					let C: Point;

					if (e.originalEvent[MODIFIERS.ROTATE]) {
						// Rotation:
						// get the rotation increment in radians
						// (bearing from "opposite" to stored coordinates
						// vs bearing from "opposite" to mouse position)
						const t = (ang(p0, merc) - ang(p0, p3));

						// rotate all points and unproject to lngLat
						A = rot(p1, p0, t);
						B = rot(p2, p0, t);
						C = rot(p3, p0, t);
					} else if (e.originalEvent[MODIFIERS.CONSERVE_RATIO]) {
						// Resize while conserving aspect ratio
						// get the ratio from the feature properties
						const { ratio } = properties;

						A = nearestPointOnLine(merc, [p0, p1]);
						B = pointAtLength([p0, p2], dis(p0, A) / ratio);
						C = nearestPointOnLine(B, [merc, A]);
					} else {
						// Simple resizing:
						// get the new positions of the two neighbouring
						// points and unproject to lngLat
						A = nearestPointOnLine(merc, [p1, p0]);
						B = nearestPointOnLine(merc, [p2, p0]);
						C = merc;
					}

					// update the coordinates in the feature collection
					this._data = updateCoordinates(
						this._data,
						[
							[[_i, 0, n1], lngLatToCo(geoUnproject(A))],
							[[_i, 0, n2], lngLatToCo(geoUnproject(B))],
							[[_i, 0, _k], lngLatToCo(geoUnproject(C))]
						]
					);
				} else {
					// change one coordinate in de the feature collection
					// at vector [_i, _j, _k]

					// only the second coordinate in circle can be updated
					if (type !== CIRCLE || _j === 1) {
						this._data = updateCoordinates(
							this._data,
							[[[_i, _j, _k], lngLatToCo(lngLat)]]
						);
					}
				}
			} else {
				// the index contains only the feature so we're going to
				// move its entire geometry
				this._data = moveGeometry(this._data, [_i], movement);
			}

			this._render();
		}
	}

	onDeleteKey() {
		if (this._index.length) {
			this._data = deleteAtIndex(this._data, this._index);

			this._index = this._index.length === 1
				? []
				: [this._index[0]];

			this._render();
		}
	}

	cleanUp() {
		this._index = [];
		this._render();
	}
}
