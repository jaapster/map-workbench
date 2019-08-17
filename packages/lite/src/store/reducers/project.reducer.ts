import { ProjectData } from 'se';
import {
	Action,
	ActionAddWorldInfo,
	ActionSetProjectData } from 'lite/store/actions/actions';
import {
	POLYGON,
	GEOGRAPHIC } from 'lite/constants';

const STATE: ProjectData = {
	businessFormRegistrations: [],
	coordinateSystems: [],
	exportDefinitions: [],
	mapDefinitions: [],
	plotOutputDefinitions: [],
	plotTemplates: [],
	queryDefinitions: [],
	reportOutputDefinitions: [],
	reportTemplates: [],
	schema: {
		$schema: '',
		id: '',
		definitions: {}
	},
	tilesApiToken: '',
	styleEndpoints: [],
	universes: [],
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
	}]
};

export const projectReducer = (state: ProjectData = STATE, action: Action): ProjectData => {
	if (ActionSetProjectData.validate(action)) {
		return {
			...ActionSetProjectData.data(action).project,
			worlds: state.worlds
		};
	}

	if (ActionAddWorldInfo.validate(action)) {
		return {
			...state,
			worlds: state.worlds.concat(ActionAddWorldInfo.data(action).worldInfo)
		};
	}

	return state;
};
