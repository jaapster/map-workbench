import bind from 'autobind-decorator';
import { Point } from '../../../../types';
import { coToLngLat, lngLatToCo } from '../../utils/util-lng-lat-to-co';
import { geoUnproject } from '../../utils/util-geo';
import { pointAtLength } from './point-at-length';
import { InteractionMode } from '../interaction-mode';
import { analyseRectangle } from './analyse-rectangle';
import { nearestPointOnLine } from '../../utils/util-math';
import { FeatureCollectionLayer } from '../layer-feature-collection';
import {
	ang,
	dis,
	rot } from '../../utils/util-point';
import {
	CIRCLE,
	THRESHOLD,
	RECTANGLE,
	MODIFIERS } from '../../../../services/constants';

@bind
export class UpdateMode extends InteractionMode {
	static create(map: any) {
		return new	UpdateMode(map);
	}

	private _model?: FeatureCollectionLayer;

	private _screenProject(a: any) {
		return this._map.project(a);
	}

	onPointerDown({ lngLat, point }: any) {
		if (!this._model) {
			return;
		}

		const {
			index,
			coordinate
		} = this._model.nearestVertex(lngLat);

		const p = this._screenProject(coToLngLat(coordinate));
		const d = dis(point, p);

		if (d < THRESHOLD) {
			this._model.index = index;
		} else {
			const {
				index,
				coordinate
			} = this._model.nearestPointOnGeometry(lngLat);

			const p = this._screenProject(coToLngLat(coordinate));
			const d = dis(point, p);

			this._model.index = d < THRESHOLD ? [index[0]] : [];
		}
	}

	onPointerDragStart(e: any) {
		if (!this._model) {
			return;
		}

		const [_i, , _k] = this._model.index;

		if (this._model && _i != null) {
			const {
				geometry: { coordinates },
				properties: { type }
			} = this._model.data.features[_i];

			if (e.originalEvent[MODIFIERS.ADD_VERTEX]) {
				if (![RECTANGLE, CIRCLE].includes(type)) {
					const {
						coordinate,
						distance,
						index
					} = this._model.nearestPointOnGeometry(e.lngLat);

					if (distance < THRESHOLD) {
						this._model.index = index;
						this._model.addAtIndex(coordinate);
					}
				}
			}

			if (type === RECTANGLE && _k != null) {
				const { p0, p1, p2 } = analyseRectangle(coordinates, _k);

				this._model.setPropertyAtIndex(
					'ratio',
					dis(p0, p1) / dis(p0, p2)
				);
			}
		}
	}

	onPointerDragMove(e: any) {
		if (!this._model) {
			return;
		}

		const [_i, _j, _k] = this._model.index;

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
				} = this._model.data.features[_i];

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
					this._model.updateCoordinates(
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
						this._model.updateCoordinates(
							[[[_i, _j, _k], lngLatToCo(lngLat)]]
						);
					}
				}
			} else {
				// the index contains only the feature so we're going to
				// move its entire geometry
				this._model.moveGeometry([_i], movement);
			}
		}
	}

	onDeleteKey() {
		if (!this._model) {
			return;
		}

		if (this._model.index.length) {
			this._model.deleteAtIndex();
		}
	}

	cleanUp() {
		if (this._model) {
			this._model.cleanUp();
		}
	}

	setModel(model: FeatureCollectionLayer) {
		this._model = model;
	}
}
