import { newRectangle } from '../utils/util-geo-json';
import { NAVIGATION_MODE } from '../../constants';
import { analyseRectangle } from '../../reducers/fn/analyse-rectangle';
import { DrawSegmentedMode } from './mode.draw-segmented';
import { nearestPointOnLine } from '../utils/util-math';
import {
	Co,
	Ev,
	Point,
	SelectionVector } from '../../types';
import {
	llToCo,
	geoUnproject } from '../utils/util-geo';
import {
	dispatch,
	getState } from '../../reducers/store';
import {
	ActionAddFeature,
	ActionDeleteSelection,
	ActionSetMapControlMode,
	ActionUpdateCoordinates } from '../../reducers/actions';
import {
	currentCollectionId,
	currentSelectionVectors,
	currentFeatureCollection } from '../../reducers/selectors/index.selectors';

export class DrawRectangleMode extends DrawSegmentedMode {
	static create(map: any) {
		return new DrawRectangleMode(map);
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
				feature: newRectangle([[co, co, co, co, co]])
			}));
		} else {
			dispatch(ActionSetMapControlMode.create({ mode: NAVIGATION_MODE }));
		}
	}

	onPointerMove({ merc, lngLat, movement, originalEvent }: Ev) {
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

		const _k = 2;

		const {
			geometry: { coordinates }
		} = currentFeatureCollection(state).features[_i];

		const { p0, p1, p2, n1, n2 } = analyseRectangle(
			coordinates,
			_k
		);

		// offset points just a little otherwise nearestPointOnLine will fail
		// todo: fix nearestPointOnLine (is that even possible?)
		p1.y += 0.0001;
		p2.x += 0.0001;

		const A: Point = nearestPointOnLine(merc, [p1, p0]);
		const B: Point = nearestPointOnLine(merc, [p2, p0]);
		const C: Point = merc;

		const entries = [
			[[_i, 0, n1], llToCo(geoUnproject(A))],
			[[_i, 0, n2], llToCo(geoUnproject(B))],
			[[_i, 0, _k], llToCo(geoUnproject(C))]
		] as [SelectionVector, Co][];

		dispatch(ActionUpdateCoordinates.create({ collectionId, entries }));
	}

	onPointerDragEnd(e: Ev) {
		dispatch(ActionSetMapControlMode.create({ mode: NAVIGATION_MODE }));
	}

	onPointerUp(e: Ev) {}

	onPointerDblClick() {}

	onEscapeKey() {
		const collectionId = currentCollectionId(getState());

		if (!collectionId) {
			return;
		}

		dispatch(ActionDeleteSelection.create({ collectionId }));
		dispatch(ActionSetMapControlMode.create({ mode: NAVIGATION_MODE }));
	}
}
