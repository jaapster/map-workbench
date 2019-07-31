import { getActionCreator } from './util-get-action-creator';
import {
	Co,
	Dict,
	Point,
	WorldData,
	FeatureData,
	UniverseData,
	SelectionVector,
	FeatureCollectionData, EPSG, MapControlMode
} from '../types';

export interface Action {
	type: string;
	data: Dict<any>;
	token: Symbol;
}

export const ActionSetUniverses = getActionCreator<{
	universeData: UniverseData[]
}>('ActionSetUniverses');

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
	movement: Point,
	vector: SelectionVector
}>('ActionMoveGeometry');

export const ActionSelect = getActionCreator<{
	collectionId: string,
	vector: SelectionVector,
	multi: boolean
}>('ActionSelect');

export const ActionClearSelection = getActionCreator<{
	collectionId: string
}>('ActionClearSelection');

export const ActionClearCollection = getActionCreator<{
	collectionId: string
}>('ActionClearCollection');

export const ActionSetCollectionData = getActionCreator<{
	collectionId: string,
	featureCollection: FeatureCollectionData
}>('ActionClearCollection');

export const ActionAddFeature = getActionCreator<{
	collectionId: string,
	feature: FeatureData<any>
}>('ActionAddFeature');

export const ActionAddVertex = getActionCreator<{
	collectionId: string,
	coordinate: Co,
	vector: SelectionVector
}>('ActionAddVertex');

export const ActionDeleteSelection = getActionCreator<{
	collectionId: string
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

export const ActionSetMapControlCenter = getActionCreator<{
	center: Co
}>('ActionSetMapControlCenter');

export const ActionSetAppPhase = getActionCreator<{
	phase: string
}>('ActionSetAppPhase');
