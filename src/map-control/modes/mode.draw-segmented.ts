import { Ev } from '../../types';
import { dis } from '../utils/util-point';
import { dispatch, getState } from '../../reducers/store';
import { dropLast } from '../utils/util-list';
import { NAVIGATION_MODE, THRESHOLD } from '../../constants';
import { InteractionMode } from './mode.interaction';
import {
	coToLl,
	llToCo } from '../utils/util-geo';
import {
	newPolygon,
	newLineString } from '../utils/util-geo-json';
import {
	ActionAddVertex,
	ActionAddFeature,
	ActionDeleteSelection,
	ActionSetCollectionData,
	ActionUpdateCoordinates,
	ActionSetMapControlMode } from '../../reducers/actions';
import {
	currentCollectionId,
	currentSelectionVectors,
	currentFeatureCollection } from '../../reducers/selectors/index.selectors';

export class DrawSegmentedMode extends InteractionMode {
	static create(map: any) {
		return new DrawSegmentedMode(map);
	}

	onPointerDown(e: Ev) {
		const state = getState();
		const collectionId = currentCollectionId(state);

		if (!collectionId) {
			return;
		}

		const co = llToCo(e.lngLat);

		const selection = currentSelectionVectors(state);
		const _i = selection[0]
			? selection[0][0]
			: undefined;

		if (_i == null) {
			dispatch(ActionAddFeature.create({
				collectionId,
				feature: newLineString([co, co])
			}));

		} else {
			const featureCollection = currentFeatureCollection(state);

			const {
				geometry: { coordinates: cos }
			} = featureCollection.features[_i];

			if (cos.length > 2) {
				const p0 = this._map.project(coToLl(cos[0]));

				if (dis(p0, e.point) < THRESHOLD) {
					dispatch(ActionSetCollectionData.create({
						collectionId,
						featureCollection: {
							...featureCollection,
							features: featureCollection.features.map((f: any, i: any) => (
								i !== _i
									? f
									: newPolygon([dropLast(1, cos).concat([cos[0]])])
							))
						}
					}));

					dispatch(ActionSetMapControlMode.create({ mode: NAVIGATION_MODE }));

					return;
				}
			}

			dispatch(ActionAddVertex.create({
				collectionId,
				coordinate: co,
				vector: [_i, cos.length - 1]
			}));
		}
	}

	onPointerMove(e: Ev) {
		const state = getState();
		const collectionId = currentCollectionId(state);

		if (!collectionId) {
			return;
		}

		const selection = currentSelectionVectors(state);
		const _i = selection[0]
			? selection[0][0]
			: undefined;

		if (_i == null) {
			return;
		}

		const { geometry: { coordinates } } = currentFeatureCollection(state).features[_i];

		dispatch(ActionUpdateCoordinates.create({
			collectionId,
			entries: [
				[[_i, coordinates.length - 1], llToCo(e.lngLat)]
			]
		}));
	}

	onPointerUp(e: Ev) {}

	onPointerDblClick() {
		const state = getState();
		const collectionId = currentCollectionId(state);

		if (!collectionId) {
			return;
		}

		const selection = currentSelectionVectors(state);
		const _i = selection[0]
			? selection[0][0]
			: undefined;

		if (_i == null) {
			return;
		}

		const featureCollection = currentFeatureCollection(state);

		dispatch(ActionSetCollectionData.create({
			collectionId,
			featureCollection: {
				...featureCollection,
				features: featureCollection.features.map((f: any, i: any) => (
					i !== _i
						? f
						: {
							...f,
							geometry: {
								...f.geometry,
								coordinates: dropLast(2, f.geometry.coordinates)
							}
						}
				))
			}
		}));

		dispatch(ActionSetMapControlMode.create({ mode: NAVIGATION_MODE }));
	}

	onEscapeKey() {
		const collectionId = currentCollectionId(getState());

		if (!collectionId) {
			return;
		}

		dispatch(ActionDeleteSelection.create({ collectionId }));
		dispatch(ActionSetMapControlMode.create({ mode: NAVIGATION_MODE }));
	}
}
