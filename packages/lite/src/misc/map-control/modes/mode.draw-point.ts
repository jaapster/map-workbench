import { Ev } from 'se';
import { dispatch, getState } from 'lite/store/store';
import { NAVIGATION_MODE } from 'lite/constants';
import { InteractionMode } from './mode.interaction';
import { llToCo } from 'lite/utils/util-geo';
import {
	ActionAddFeature,
	ActionDeleteSelection,
	ActionSetMapControlMode } from 'lite/store/actions/actions';
import { currentCollectionId } from 'lite/store/selectors/index.selectors';
import { newPoint } from 'lite/utils/util-geo-json';
import { batchActions } from 'redux-batched-actions';

export class DrawPointMode extends InteractionMode {
	static create(map: any) {
		return new DrawPointMode(map);
	}

	onPointerDown(e: Ev) {
		const state = getState();
		const collectionId = currentCollectionId(state);

		if (!collectionId) {
			return;
		}

		const co = llToCo(e.lngLat);

		dispatch(batchActions([
			ActionAddFeature.create({ collectionId, feature: newPoint(co) }),
			ActionSetMapControlMode.create({ mode: NAVIGATION_MODE })
		]));
	}

	onPointerUp(e: Ev) {}

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
