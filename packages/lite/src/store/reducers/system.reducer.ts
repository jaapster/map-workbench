import { Co, SystemData } from 'se';
import {
	Action,
	ActionLogout,
	ActionSetAppId,
	ActionSetUserData,
	ActionSetAppPhase,
	ActionSetServerInfo,
	ActionSetAuthorized,
	ActionSetProjectData,
	ActionSetAuthenticated,
	ActionSetServerSettings,
	ActionSetApplicationInfo,
	ActionSetApplicationsList,
	ActionSetAuthenticationError } from 'lite/store/actions/actions';
import { GEOGRAPHIC, POLYGON } from 'lite/constants';

const STATE: SystemData = {
	user: null,
	appId: '',
	worlds: [{
		worldId: 'DEFAULT',
		universeIndex: 0,
		defaultEnvelope: {
			type: POLYGON,
			coordinates: [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]],
			crs: {
				properties: {
					href: `http://www.spatialreference.org/ref/epsg/${ GEOGRAPHIC }/json/`,
					type: 'json'
				},
				type: 'Link'
			},
			metadata: {
				epsgCode: GEOGRAPHIC,
				measurementInfo: 1,
				world: {
					universeIndex: 0,
					worldId: 'DEFAULT'
				}
			}
		},
		description: '',
		transform: { scale: 1 },
		unitFactor: 1
	}],
	server: null,
	project: null,
	appPhase: 'booting',
	authorized: false,
	application: null,
	applications: [],
	authenticated: false,
	requestPending: false,
	serverSettings: null,
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

	if (ActionSetUserData.validate(action)) {
		return {
			...state,
			user: ActionSetUserData.data(action).userData
		};
	}

	if (ActionSetApplicationsList.validate(action)) {
		return {
			...state,
			applications: ActionSetApplicationsList.data(action).applications
		};
	}

	if (ActionSetApplicationInfo.validate(action)) {
		return {
			...state,
			application: ActionSetApplicationInfo.data(action).application
		};
	}

	if (ActionSetServerInfo.validate(action)) {
		return {
			...state,
			server: ActionSetServerInfo.data(action).server
		};
	}

	if (ActionSetServerSettings.validate(action)) {
		return {
			...state,
			serverSettings: ActionSetServerSettings.data(action).settings
		};
	}

	if (ActionSetProjectData.validate(action)) {
		return {
			...state,
			project: ActionSetProjectData.data(action).project
		};
	}

	return state;
};
