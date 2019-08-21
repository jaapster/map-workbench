import axios from 'axios';
import { Dispatch } from 'redux';
import { MapControl } from 'lite/misc/map-control/map-control';
import { extractData } from 'lite/utils/util-extract-data';
import { batchActions } from 'redux-batched-actions';
import { getActionCreator } from './util-get-action-creator';
import { getSelectionBuffer } from 'lite/utils/util-get-selection-buffer';
import { SecondaryMapControl } from 'lite/misc/map-control/secondary-map-control';
import {
	appId,
	projectPath,
	selectionPath } from '../selectors/index.selectors';
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
	VectorStyle,
	ProjectData,
	LanguagePack,
	WorldInfoData,
	ServerInfoData,
	MapControlMode,
	SelectionVector,
	FeatureCollection,
	ServerSettingsData,
	ApplicationInfoData,
	ApplicationListData } from 'se';

export interface Action {
	type: string;
	data: Dict<any>;
	token: Symbol;
}

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

export const ActionSetVectorLayers = getActionCreator<{
	vectorLayers: VectorStyle[];
}>('ActionSetVectorLayers');

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
	create({ universeIndex, id }: { universeIndex: number, id: string }) {
		return (dispatch: Dispatch, getState: () => State) => {
			const state = getState();

			axios.get(`${ projectPath(state) }/universes/${ universeIndex }/worlds/${ id }`)
				.then(({ data: worldInfo }: { data: WorldInfoData }) => {
				dispatch(ActionAddWorldInfo.create({ worldInfo: {
					...worldInfo,
					id,
					universeIndex
				} as WorldInfoData }));
			});
		};
	}
};

export const ActionLoadProject = {
	create({ projectId }: { projectId: string }) {
		return (dispatch: Dispatch, getState: () => State) => {
			const state = getState();

			Promise.all([
				axios.get('/api/referencelayers'),
				axios.get('/api/bookmarks'),
				axios.get('/api/languages')
			]).then((responses) => {
				const [
					layers,
					bookmarks,
					languagePacks
				] = responses.map(extractData);

				const [layer, style] = layers[1];

				const controlConfig = {
					location: bookmarks[0],
					style
				};

				MapControl.create(controlConfig);

				SecondaryMapControl.create(controlConfig);

				dispatch(
					batchActions([
						ActionSetBookmarks.create({ bookmarks }),
						ActionSetLanguagePacks.create({ languagePacks }),
						ActionSetReferenceLayers.create({ layers }),
						ActionSetCurrentReferenceLayer.create({ layer })
					]
				));
			}).then(() => {
				axios
					.get(`/api/v2/applications/${ appId(state) }/projects/${ projectId }`)
					.then(({ data: project }: { data: ProjectData }) => (
						Promise.all(project.styleEndpoints.map(endpoint => (
							Promise.all(endpoint.modes.map(mode => (
								axios.get(mode.url).then(async ({ data: style }) => (
									// add all sprites from style to mapbox as images
									Promise.all(style.sprites.map(({ id, data }: any) => (
										new Promise(resolve => Object.assign(new Image(), {
											onload() {
												MapControl.instance.addImage(id, this);
												SecondaryMapControl.instance.addImage(id, this);
												resolve();
											},
											src: `data:image/png;base64,${ data }`
										}))
									))).then(() => (
										{
											...mode,
											style: {
												...style,
												sources: Object.keys(style.sources).reduce((m, key) => (
													{
														...m,
														[key]: {
															...style.sources[key],
															tiles: style.sources[key].tiles.map((url: string) => (
																// todo: shouldn't have to do this
																url.replace(
																	/.*\/v2/,
																	// mapbox demands url includes the host
																	`${ location.origin }/api/v2/applications/${ appId(state) }`
																)
															))
														}
													}
												), {})
											}
										}
									))
								))
							))).then(modes => (
								{
									...endpoint,
									modes
								}
							))
						))).then((vectorLayers: VectorStyle[]) => (
							dispatch(batchActions([
								ActionSetProjectData.create({
									project: {
										...project,
										id: projectId
									}
								}),
								ActionSetVectorLayers.create({ vectorLayers }),
								ActionSetAppPhase.create({ phase: 'booted' })
							]))
						))
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

					// for now, just select first project in list
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
								ActionSetAuthenticated.create({ authenticated: true })
							]));

							// @ts-ignore
							dispatch(ActionLoadInfo.create());
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
