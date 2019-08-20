import { Ev } from 'se';
import { llToCo } from 'lite/utils/util-geo';
import { newCircle } from 'lite/utils/util-geo-json';
import { NAVIGATION_MODE } from 'lite/constants';
import { DrawSegmentedMode } from './mode.draw-segmented';
import {
	dispatch,
	getState } from 'lite/store/store';
import {
	ActionAddFeature,
	ActionDeleteSelection,
	ActionSetMapControlMode } from 'lite/store/actions/actions';
import {
	currentCollectionId,
	currentSelectionVectors } from 'lite/store/selectors/index.selectors';
import { batchActions } from 'redux-batched-actions';

export class DrawCircleMode extends DrawSegmentedMode {
	static create(map: any) {
		return new DrawCircleMode(map);
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
				feature: newCircle([co, co])
			}));
		} else {
			dispatch(ActionSetMapControlMode.create({ mode: NAVIGATION_MODE }));
		}
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

		dispatch(batchActions([
			ActionDeleteSelection.create({ collectionId }),
			ActionSetMapControlMode.create({ mode: NAVIGATION_MODE })
		]));
	}
}