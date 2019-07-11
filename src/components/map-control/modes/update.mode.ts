import bind from 'autobind-decorator';
import { InteractionMode } from './interaction.mode';
import { FeatureCollectionModel } from '../../../models/feature-collection/feature-collection.model';
import {
	pointAtLength,
	nearestPointOnLine } from '../utils/util-math';
import {
	ang,
	dis,
	rot } from '../utils/util-point';
import {
	Co,
	Ev,
	Point
} from '../../../types';
import {
	CIRCLE,
	THRESHOLD,
	RECTANGLE,
	MODIFIERS } from '../../../constants';
import {
	coToLl,
	llToCo,
	geoUnproject, geoProject
} from '../utils/util-geo';

const analyseRectangle = (coordinates: Co[][], nv: number) => {
	const [cos] = coordinates;

	// get the coordinate indices of the points
	// opposite, clockwise and counter clockwise from
	// the point that is dragged
	const n0 = [2, 3, 0, 1, 2][nv];
	const n1 = [1, 2, 3, 0, 1][nv];
	const n2 = [3, 0, 1, 2, 3][nv];

	// get screen positions for the coordinates
	const p0 = geoProject(coToLl(cos[n0]));
	const p1 = geoProject(coToLl(cos[n1]));
	const p2 = geoProject(coToLl(cos[n2]));
	const p3 = geoProject(coToLl(cos[nv]));

	return { p0, p1, p2, p3, n0, n1, n2 };
};

@bind
export class UpdateMode extends InteractionMode {
	static create(map: any) {
		return new	UpdateMode(map);
	}

	private _model?: FeatureCollectionModel;

	onPointerDragStart({ lngLat, point, originalEvent }: Ev) {
		if (this._model) {
			const [_i, , _k] = this._model.index;

			if (this._model && _i != null) {
				const {
					geometry: { coordinates },
					properties: { type }
				} = this._model.data.features[_i];

				if (originalEvent[MODIFIERS.ADD_VERTEX]) {
					if (![RECTANGLE, CIRCLE].includes(type)) {
						const {
							index,
							coordinate
						} = this._model.nearestPointOnGeometry(lngLat);

						const p = this._map.project(coToLl(coordinate));
						const d = dis(point, p);

						if (d < THRESHOLD) {
							this._model.select(index);
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
	}

	onPointerDragMove({ merc, lngLat, movement, originalEvent }: Ev) {
		if (this._model) {
			const [_i, _j, _k, _l] = this._model.index;

			if (_i != null) {
				if (_j != null) {
					// the index contains more than just the feature index
					// so we're going to update one or more coordinates
					// in its geometry
					const {
						geometry: { coordinates },
						properties: { type, ratio }
					} = this._model.data.features[_i];

					if (type === RECTANGLE) {
						const { p0, p1, p2, p3, n1, n2 } = analyseRectangle(
							coordinates,
							_k
						);

						let A: Point;
						let B: Point;
						let C: Point;

						if (originalEvent[MODIFIERS.ROTATE]) {
							// Rotation:
							// get the rotation increment in radians
							// (bearing from "opposite" to stored coordinates
							// vs bearing from "opposite" to mouse position)
							const t = (ang(p0, merc) - ang(p0, p3));

							// rotate all points and unproject to lngLat
							A = rot(p1, p0, t);
							B = rot(p2, p0, t);
							C = rot(p3, p0, t);
						} else if (originalEvent[MODIFIERS.CONSERVE_RATIO]) {
							// Resize while conserving aspect ratio
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
								[[_i, 0, n1], llToCo(geoUnproject(A))],
								[[_i, 0, n2], llToCo(geoUnproject(B))],
								[[_i, 0, _k], llToCo(geoUnproject(C))]
							]
						);
					} else {
						// change one coordinate in de the feature collection
						// at vector [_i, _j, _k]

						// only the second coordinate in circle can be updated
						if (type !== CIRCLE || _j === 1) {
							this._model.updateCoordinates(
								[[[_i, _j, _k, _l], llToCo(lngLat)]]
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
	}

	setModel(model: FeatureCollectionModel) {
		this._model = model;
	}
}
