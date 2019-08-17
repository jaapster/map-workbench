import  {ServerInfoData } from 'se';
import {
	Action,
	ActionSetServerInfo } from 'lite/store/actions/actions';

const STATE: ServerInfoData = {
	apiVersion: '',
	globalEnumerations: {
		fieldType: {}
	},
	name: '',
	serverBuildDate: '',
	serviceEndpoints: {
		api: '',
		static: '',
		tiles: ''
	},
	serviceProviders: {
		geoCoders: [],
		tileProviders: []
	}
};

export const serverReducer = (state: ServerInfoData = STATE, action: Action): ServerInfoData => {
	if (ActionSetServerInfo.validate(action)) {
		return ActionSetServerInfo.data(action).server;
	}

	return state;
};
