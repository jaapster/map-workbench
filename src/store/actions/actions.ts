import axios from 'axios';
import { Dispatch } from 'redux';
import { selectionPath } from '../selectors/index.selectors';
import { getActionCreator } from './util-get-action-creator';
import { getSelectionBuffer } from '../../utils/util-get-selection-buffer';
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
	WorldData,
	UnitSystem,
	MapboxStyle,
	LanguagePack,
	UniverseData,
	MapControlMode,
	SelectionVector,
	FeatureCollection } from '../../types';
import { batchActions } from 'redux-batched-actions';
import { MapControl } from '../../misc/map-control/map-control';
import { SecondaryMapControl } from '../../misc/map-control/secondary-map-control';

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

export const ActionAuthorize = getActionCreator<{
}>('ActionAuthorize');

export const ActionLogout = getActionCreator<{
}>('ActionLogout');

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

export const ActionLoadProject = {
	create() {
		return (dispatch: Dispatch) => {
			Promise
				.all([
					axios.get('/api/universes'),
					axios.get('/api/worlds'),
					axios.get('/api/referencelayers'),
					axios.get('/api/bookmarks'),
					axios.get('/api/languages')
				])
				.then((responses) => {
					const [universeData, worlds, layers, bookmarks, languagePacks] = responses.map(r => r.data);

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
										featureCollection: collection,
										selection: [],
										name: collection.properties.name
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
