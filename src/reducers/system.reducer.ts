import { SystemData } from '../types';
import {
	Action,
	ActionAuthorize,
	ActionLogout,
	ActionSetAppPhase
} from './actions/actions';

const STATE: SystemData = {
	appPhase: 'booting',
	authorized: false
};

export const systemReducer = (state: SystemData = STATE, action: Action): SystemData => {
	if (ActionSetAppPhase.validate(action)) {
		return {
			...state,
			appPhase: ActionSetAppPhase.data(action).phase
		};
	}

	if (ActionAuthorize.validate(action)) {
		return {
			...state,
			authorized: true
		};
	}

	if (ActionLogout.validate(action)) {
		return {
			...state,
			authorized: false
		};
	}

	return state;
};
