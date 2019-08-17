import axios from 'axios';
import { Dispatch } from 'redux';
import { appId, projectId, selectionPath } from '../selectors/index.selectors';
import { getActionCreator } from './util-get-action-creator';
import { getSelectionBuffer } from 'lite/utils/util-get-selection-buffer';
import {
	Co,
	Pt,
	Dict,
	EPSG,
	State,
	Polygon,
	Feature,
	Geometry,
	Location,
	UserData,
	WorldData,
	UnitSystem,
	MapboxStyle,
	LanguagePack,
	UniverseData,
	ServerInfoData,
	MapControlMode,
	SelectionVector,
	FeatureCollection,
	ApplicationInfoData,
	ApplicationListData,
	ServerSettingsData,
	ProjectData,
	WorldInfoData
} from 'se';
import { batchActions } from 'redux-batched-actions';
import { MapControl } from 'lite/misc/map-control/map-control';
import { SecondaryMapControl } from 'lite/misc/map-control/secondary-map-control';
import { extractData } from 'lite/utils/util-extract-data';

export interface Action {
	type: string;
	data: Dict<any>;
	token: Symbol;
}

export const ActionSetUniverses = getActionCreator<{
	universeData: UniverseData[]
}>('ActionSetUniverses');

export const ActionSetReferenceLayers = getActionCreator<{
	layers: [string, (string | MapboxStyle)][]
}>('ActionSetReferenceLayers');

export const ActionSetCurrentReferenceLayer = getActionCreator<{
	layer: string
}>('ActionSetCurrentReferenceLayer');

export const ActionAddWorld = getActionCreator<{
	worldData: WorldData
}>('ActionAddWorld');

export const ActionGoToWorld = getActionCreator<{
	worldId: string
}>('ActionGoToWorld');

export const ActionUpdateCoordinates = getActionCreator<{
	collectionId: string,
	entries: [number[], Co][]
}>('ActionUpdateCoordinates');

export const ActionMoveGeometry = getActionCreator<{
	collectionId: string,
	movement: Pt,
	vector: SelectionVector
}>('ActionMoveGeometry');

export const ActionSelect = getActionCreator<{
	vector: SelectionVector,
	multi: boolean
}>('ActionSelect');

export const ActionClearSelection = getActionCreator<{
}>('ActionClearSelection');

export const ActionSetCollectionData = getActionCreator<{
	collectionId: string,
	featureCollection: FeatureCollection
}>('ActionSetCollectionData');

export const ActionAddFeature = getActionCreator<{
	collectionId: string,
	feature: Feature<Geometry>
}>('ActionAddFeature');

export const ActionAddVertex = getActionCreator<{
	collectionId: string,
	coordinate: Co,
	vector: SelectionVector
}>('ActionAddVertex');

export const ActionDeleteSelection = getActionCreator<{
}>('ActionDeleteSelection');

export const ActionSetCollection = getActionCreator<{
	collectionId: string
}>('ActionSetCollection');

export const ActionSetMapControlCRS = getActionCreator<{
	CRS: EPSG
}>('ActionSetMapControlCRS');

export const ActionSetMapControlMode = getActionCreator<{
	mode: MapControlMode
}>('ActionSetMapControlMode');

export const ActionSetMapControlZoom = getActionCreator<{
	zoom: number
}>('ActionSetMapControlZoom');

export const ActionSetOverviewOffset = getActionCreator<{
	offset: number
}>('ActionSetOverviewOffset');

export const ActionSetMapControlCenter = getActionCreator<{
	center: Co
}>('ActionSetMapControlCenter');

export const ActionSetAppPhase = getActionCreator<{
	phase: string
}>('ActionSetAppPhase');

export const ActionSetAppId = getActionCreator<{
	appId: string
}>('ActionSetAppPhase');

export const ActionSetActiveTab = getActionCreator<{
	tabGroupId: string;
	activeTab: number
}>('ActionSetActiveTab');

export const ActionSetPanelCollapsed = getActionCreator<{
	panelGroupId: string;
	collapsed: boolean;
}>('ActionSetPanelCollapsed');

export const ActionShowPropertiesPanel = getActionCreator<{
}>('ActionSetPanelCollapsed');

export const ActionSetGeoLocationPosition = getActionCreator<{
	position: Co;
	accuracy: number;
}>('ActionSetGeoLocationPosition');

export const ActionSetBookmarks = getActionCreator<{
	bookmarks: Location[];
}>('ActionSetBookmarks');

export const ActionSetUnitSystem = getActionCreator<{
	unitSystem: UnitSystem;
}>('ActionSetUnitSystem');

export const ActionToggleUnitSystem = getActionCreator<{
}>('ActionToggleUnitSystem');

export const ActionSetUIScale = getActionCreator<{
	UIScale: number;
}>('ActionSetUIScale');

export const ActionSetLanguage = getActionCreator<{
	language: string;
}>('ActionSetLanguage');

export const ActionSetLanguagePacks = getActionCreator<{
	languagePacks: LanguagePack[];
}>('ActionSetLanguagePacks');

export const ActionToggleOverview = getActionCreator<{
}>('ActionToggleOverview');

export const ActionSetMapControlMetrics = getActionCreator<{
	zoom: number;
	pitch: number;
	mouse: Co;
	center: Co;
	extent: Feature<Polygon>;
	bearing: number;
}>('ActionSetMapControlMetrics');

export const ActionSetGlare = getActionCreator<{
	glare: boolean;
}>('ActionSetGlare');

export const ActionLogout = getActionCreator<{
}>('ActionLogout');

export const ActionSetAuthorized = getActionCreator<{
	authorized: boolean;
}>('ActionSetAuthorized');

export const ActionSetAuthenticated = getActionCreator<{
	authenticated: boolean;
}>('ActionSetAuthenticated');

export const ActionSetAuthenticationError = getActionCreator<{
	authenticationError: string;
}>('ActionSetAuthenticationError');

export const ActionSetUserData = getActionCreator<{
	userData: UserData;
}>('ActionSetUserData');

export const ActionSetApplicationsList = getActionCreator<{
	applications: ApplicationListData[];
}>('ActionSetApplicationsList');

export const ActionSetServerInfo = getActionCreator<{
	server: ServerInfoData;
}>('ActionSetServerInfo');

export const ActionSetApplicationInfo = getActionCreator<{
	application: ApplicationInfoData;
}>('ActionSetApplicationInfo');

export const ActionSetServerSettings = getActionCreator<{
	settings: ServerSettingsData;
}>('ActionSetServerSettings');

export const ActionSetProjectData = getActionCreator<{
	project: ProjectData;
}>('ActionSetProjectData');

export const ActionAddWorldInfo = getActionCreator<{
	worldInfo: WorldInfoData;
}>('ActionAddWorldInfo');

export const ActionRequestSelection = {
	create({ point }: { point: Pt }) {
		return (dispatch: Dispatch, getState: () => State) => {
			const state = getState();

			axios.post(selectionPath(state), {
				zoom: 10,
				geometry: getSelectionBuffer(point)
				// @ts-ignore
			}).then(res => console.log(res.data));
		};
	}
};

export const ActionLoadWorldInfo = {
	create({ universeIndex, worldId }: { universeIndex: number, worldId: string }) {
		return (dispatch: Dispatch, getState: () => State) => {
			const state = getState();

			axios.get(`/api/v2/applications/${ 
				appId(state) 
			}/projects/${ 
				projectId(state) 
			}/universes/${
				universeIndex
			}/worlds/${
				worldId
			}`).then(({ data: worldInfo }: { data: WorldInfoData }) => {
				dispatch(ActionAddWorldInfo.create({ worldInfo }));
			});
		};
	}
};

export const ActionLoadProject = {
	create({ projectId }: { projectId: string }) {
		return (dispatch: Dispatch, getState: () => State) => {
			const state = getState();

			axios
				.get(`/api/v2/applications/${ appId(state) }/projects/${ projectId }`)
				.then(({ data: project }: { data: ProjectData }) => {
					dispatch(ActionSetProjectData.create({ project }));
				});

			Promise
				.all([
					axios.get('/api/universes'),
					axios.get('/api/worlds'),
					axios.get('/api/referencelayers'),
					axios.get('/api/bookmarks'),
					axios.get('/api/languages')
				])
				.then((responses) => {
					const [
						universeData,
						worlds,
						layers,
						bookmarks,
						languagePacks
					] = responses.map(extractData);

					const [layer, style] = layers[1];

					MapControl.create({
						location: bookmarks[0],
						style
					});

					SecondaryMapControl.create({
						location: bookmarks[0],
						style
					});

					dispatch(
						batchActions([
							ActionSetUniverses.create({ universeData }),
							ActionSetBookmarks.create({ bookmarks }),
							ActionSetLanguagePacks.create({ languagePacks }),
							ActionSetReferenceLayers.create({ layers }),
							ActionSetCurrentReferenceLayer.create({ layer })
						]
						.concat(worlds.map((worldData: any) => ActionAddWorld.create({
							worldData: {
								...worldData,
								collections: worldData.collections.map((collection: any) => (
									{
										name: collection.properties.name,
										selection: [],
										featureCollection: collection
									}
								))
							}
						})))
						.concat([
							ActionSetAppPhase.create({ phase: 'booted' })
						])
					));
				});
		};
	}
};

export const ActionLoadInfo = {
	create() {
		return (dispatch: Dispatch, getState: () => State) => {
			const state = getState();

			Promise
				.all([
					axios.get(`/api/v2/applications/${ appId(state) }/server`),
					axios.get(`/api/v2/applications/${ appId(state) }/store/settings`),
					axios.get(`/api/v2/applications/${ appId(state) }`)
				])
				.then((responses: any[]) => {
					const [
						server,
						settings,
						application
					] = responses.map(extractData) as [
						ServerInfoData,
						ServerSettingsData,
						ApplicationInfoData
					];

					dispatch(batchActions([
						ActionSetServerInfo.create({ server }),
						ActionSetServerSettings.create({ settings }),
						ActionSetApplicationInfo.create({ application })
					]));

					const project = application.projects[0];

					if (project) {
						// @ts-ignore
						dispatch(ActionLoadProject.create({ projectId: project.projectID }));
					} else {
						// uh-oh
					}
				});
		};
	}
};

export const ActionAuthorize = {
	create() {
		return (dispatch: Dispatch) => {
			Promise
				.all([
					axios.get('application.json'),
					axios.get('/api/v2/user'),
					axios.get('/api/v2/applications')
				])
				.then((responses: any[]) => {
					const [
						{ id: appId },
						userData,
						{ applications }
					] = responses.map(extractData) as [
						{ id: string },
						UserData,
						{ applications: ApplicationListData[] }
					];

					if (userData.isAuthenticated) {
						// check is user is authorized for the
						// current application
						const applicationData = applications.find(({ id }) => id === appId);

						if (applicationData) {
							dispatch(batchActions([
								ActionSetAppId.create({ appId }),
								ActionSetUserData.create({ userData }),
								ActionSetAuthorized.create({ authorized: true }),
								ActionSetAuthenticated.create({ authenticated: true }),
								ActionSetApplicationsList.create({ applications })
							]));

							// @ts-ignore
							dispatch(ActionLoadInfo.create());

							// this is async so can't be in the above batch
							// @ts-ignore
							// dispatch(ActionLoadProject.create());
						} else {
							console.error('The authenticated' +
								' user is not authorized for this' +
								' application');
						}
					}
				});
		};
	}
};

export const ActionAuthenticate = {
	create(credentials: { userName: string, password: string }) {
		return (dispatch: Dispatch) => {
			dispatch(ActionSetAppPhase.create({ phase: 'loading' }));

			axios
				.post('/auth/xy', credentials)
				.then(({ data }) => {
					if (data.isSuccess) {
						// @ts-ignore
						dispatch(ActionAuthorize.create());
					} else {
						// uh-oh
					}
				})
				.catch(({ response: { status } }: any) => {
					dispatch(ActionSetAuthenticationError.create({
						authenticationError: `${ status }`
					}));
				});
		};
	}
};
