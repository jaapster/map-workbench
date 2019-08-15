import { SystemData } from '../../types';
import {
	Action,
	ActionLogout,
	ActionSetAppPhase,
	ActionSetAuthorized,
	ActionSetAuthenticated,
	ActionSetAuthenticationError } from '../actions/actions';

const STATE: SystemData = {
	appId: '',
	appPhase: 'booting',
	authorized: false,
	authenticated: false,
	requestPending: false,
	authenticationError: null
};

export const systemReducer = (state: SystemData = STATE, action: Action): SystemData => {
	if (ActionSetAppPhase.validate(action)) {
		return {
			...state,
			appPhase: ActionSetAppPhase.data(action).phase
		};
	}

	if (ActionLogout.validate(action)) {
		return {
			...state,
			authorized: false,
			authenticated: false
		};
	}

	if (ActionSetAuthorized.validate(action)) {
		return {
			...state,
			authorized: ActionSetAuthorized.data(action).authorized
		};
	}

	if (ActionSetAuthenticated.validate(action)) {
		const authenticated = ActionSetAuthenticated.data(action).authenticated;

		return {
			...state,
			authenticated,
			authenticationError: authenticated
				? null
				: state.authenticationError
		};
	}

	if (ActionSetAuthenticationError.validate(action)) {
		return {
			...state,
			authenticationError: ActionSetAuthenticationError.data(action).authenticationError
		};
	}

	return state;
};
