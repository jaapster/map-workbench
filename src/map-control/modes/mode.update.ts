import bind from 'autobind-decorator';
import { dispatch, getState } from '../../reducers/store';
import { InteractionMode } from './mode.interaction';
import { analyseRectangle } from '../../reducers/fn/analyse-rectangle';
import { getNearestPointOnGeometry } from '../../reducers/fn/get-nearest-point-on-geometry';
import {
	pointAtLength,
	nearestPointOnLine } from '../utils/util-math';
import {
	ang,
	dis,
	rot } from '../utils/util-point';
import {
	Ev,
	Point } from '../../types';
import {
	CIRCLE,
	THRESHOLD,
	RECTANGLE,
	MODIFIERS } from '../../constants';
import {
	coToLl,
	llToCo,
	geoUnproject } from '../utils/util-geo';
import {
	ActionSelect,
	ActionAddVertex,
	ActionMoveGeometry,
	ActionUpdateCoordinates } from '../../reducers/actions';
import {
	currentCollectionId,
	currentSelectionVectors,
	currentFeatureCollection } from '../../reducers/selectors/index.selectors';

@bind
export class ModeUpdate extends InteractionMode {
	static create(map: any) {
		return new	ModeUpdate(map);
	}

	// used to store initial rectangle ratio on start drag
	private _ratio = 1;

	onPointerDragStart({ lngLat, point, originalEvent }: Ev) {
		const state = getState();
		const collectionId = currentCollectionId(getState());

		if (collectionId) {
			const [_i, , _k] = currentSelectionVectors(state)[0];

			if (_i != null) {
				const featureCollection = currentFeatureCollection(state);

				const {
					geometry: { coordinates },
					properties: { type }
				} = featureCollection.features[_i];

				if (originalEvent[MODIFIERS.ADD_VERTEX]) {
					if (![RECTANGLE, CIRCLE].includes(type)) {
						const {
							index: vector,
							coordinate
						} = getNearestPointOnGeometry(lngLat, featureCollection);

						const p = this._map.project(coToLl(coordinate));
						const d = dis(point, p);

						if (d < THRESHOLD) {
							dispatch(ActionSelect.create({
								multi: false,
								vector,
								collectionId
							}));

							dispatch(ActionAddVertex.create({
								vector,
								coordinate,
								collectionId
							}));
						}
					}
				}

				if (type === RECTANGLE && _k != null) {
					const { p0, p1, p2 } = analyseRectangle(coordinates, _k);

					this._ratio = dis(p0, p1) / dis(p0, p2);
				}
			}
		}
	}

	onPointerDragMove({ merc, lngLat, movement, originalEvent }: Ev) {
		const state = getState();
		const collectionId = currentCollectionId(state);

		if (collectionId) {
			const [_i, _j, _k, _l] = currentSelectionVectors(state)[0];

			if (_i != null) {
				if (_j != null) {
					// the index contains more than just the feature index
					// so we're going to update one or more coordinates
					// in its geometry
					const {
						geometry: { coordinates },
						properties: { type }
					} = currentFeatureCollection(state).features[_i];

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
							B = pointAtLength([p0, p2], dis(p0, A) / this._ratio);
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
						dispatch(ActionUpdateCoordinates.create({
							collectionId,
							entries: [
								[[_i, 0, n1], llToCo(geoUnproject(A))],
								[[_i, 0, n2], llToCo(geoUnproject(B))],
								[[_i, 0, _k], llToCo(geoUnproject(C))]
							]
						}));
					} else {
						// change one coordinate in de the feature collection
						// at vector [_i, _j, _k]

						// only the second coordinate in circle can be updated
						if (type !== CIRCLE || _j === 1) {
							dispatch(ActionUpdateCoordinates.create({
								collectionId,
								entries: [[[_i, _j, _k, _l], llToCo(lngLat)]]
							}));
						}
					}
				} else {
					// the index contains only the feature so we're going to
					// move its entire geometry
					dispatch(ActionMoveGeometry.create({
						collectionId,
						movement,
						vector: [_i]
					}));
				}
			}
		}
	}
}
