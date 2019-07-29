import { getActionCreator } from './util';
import {
	Co,
	Point,
	WorldData,
	FeatureData,
	UniverseData,
	SelectionVector, Dict
} from '../types';

export interface Action {
	type: string;
	data: Dict<any>;
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
	vector: SelectionVector,
	amount: Point
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