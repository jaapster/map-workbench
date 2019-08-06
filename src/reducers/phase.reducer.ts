import {
	Action,
	ActionSetAppPhase } from './actions';

export const appPhaseReducer = (state: string = 'booting', action: Action): string => {
	if (ActionSetAppPhase.validate(action)) {
		return ActionSetAppPhase.data(action).phase;
	}

	return state;
};
