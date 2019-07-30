import { Ev } from '../../types';
import { dis } from '../utils/util-point';
import { dispatch } from '../../reducers/store';
import { dropLast } from '../utils/util-list';
import { THRESHOLD } from '../../constants';
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
	ActionUpdateCoordinates } from '../../reducers/actions';
import {
	getSelection,
	getFeatureAtIndex,
	getFeatureCollection,
	getCurrentCollectionId } from '../../reducers/selectors/index.selectors';

export class DrawMode extends InteractionMode {
	static create(map: any) {
		return new DrawMode(map);
	}

	onPointerDown(e: Ev) {
		const collectionId = getCurrentCollectionId();

		if (!collectionId) {
			return;
		}

		const co = llToCo(e.lngLat);

		// todo: implement drawing of new points, rectangles and circles
		const selection = getSelection(collectionId);
		const _i = selection[0]
			? selection[0][0]
			: undefined;

		if (_i == null) {
			dispatch(ActionAddFeature.create({
				collectionId,
				feature: newLineString([co, co])
			}));

		} else {
			const {
				geometry: { coordinates: cos }
			} = getFeatureAtIndex(collectionId, _i);

			if (cos.length > 2) {
				const p0 = this._map.project(coToLl(cos[0]));
				const featureCollection = getFeatureCollection(collectionId);

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

					this.trigger('finish');

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
		const collectionId = getCurrentCollectionId();

		if (!collectionId) {
			return;
		}

		// todo: implement drawing of new points, rectangles and circles
		const selection = getSelection(collectionId);
		const _i = selection[0]
			? selection[0][0]
			: undefined;

		if (_i == null) {
			return;
		}

		const { geometry: { coordinates } } = getFeatureAtIndex(collectionId, _i);

		dispatch(ActionUpdateCoordinates.create({
			collectionId,
			entries: [
				[[_i, coordinates.length - 1], llToCo(e.lngLat)]
			]
		}));
	}

	onPointerUp(e: Ev) {}

	onPointerDblClick() {
		const collectionId = getCurrentCollectionId();

		if (!collectionId) {
			return;
		}

		// todo: implement drawing of new points, rectangles and circles
		const selection = getSelection(collectionId);
		const _i = selection[0]
			? selection[0][0]
			: undefined;

		if (_i == null) {
			return;
		}

		const featureCollection = getFeatureCollection(collectionId);

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

		this.trigger('finish');
	}

	onEscapeKey() {
		const collectionId = getCurrentCollectionId();

		if (!collectionId) {
			return;
		}

		dispatch(ActionDeleteSelection.create({ collectionId }));

		this.trigger('finish');
	}
}
