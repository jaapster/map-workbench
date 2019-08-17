import { SystemData } from 'se';
import {
	Action,
	ActionLogout,
	ActionSetAppId,
	ActionSetAppPhase,
	ActionSetAuthorized,
	ActionSetAuthenticated,
	ActionSetAuthenticationError } from 'lite/store/actions/actions';

const STATE: SystemData = {
	appId: '',
	appPhase: 'booting',
	authorized: false,
	authenticated: false,
	requestPending: false,
	authenticationError: null
};

export const systemReducer = (state: SystemData = STATE, action: Action): SystemData => {
	if (ActionSetAppId.validate(action)) {
		return {
			...state,
			appId: ActionSetAppId.data(action).appId
		};
	}

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
