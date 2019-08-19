import { VectorStyle } from 'se';
import {
	Action,
	ActionSetVectorLayers } from 'lite/store/actions/actions';

const STATE: VectorStyle[] = [];

export const vectorStylesReducer = (state: VectorStyle[] = STATE, action: Action): VectorStyle[] => {
	if (ActionSetVectorLayers.validate(action)) {
		return ActionSetVectorLayers.data(action).vectorLayers;
	}

	return state;
};
