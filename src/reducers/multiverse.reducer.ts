import { oc } from 'ts-optchain';
import { addAtIndex } from './fn/add-at-index';
import { moveGeometry } from './fn/move-geometry';
import { deleteAtIndex } from './fn/delete-at-index';
import { MultiverseData } from '../types';
import { updateCoordinates } from './fn/update-coordinate';
import { EMPTY_FEATURE_COLLECTION } from '../constants';
import {
	Action,
	ActionSelect,
	ActionAddWorld,
	ActionAddVertex,
	ActionGoToWorld,
	ActionAddFeature,
	ActionMoveGeometry,
	ActionSetUniverses,
	ActionSetCollection,
	ActionClearSelection,
	ActionClearCollection,
	ActionDeleteSelection,
	ActionUpdateCoordinates,
	ActionSetCollectionData } from './actions';

const STATE: MultiverseData = {
	worlds: {},
	universes: [],
	currentWorldId: 'default'
};

const not = (fn: (...args: any[]) => any) => (...args: any[]) => !fn(...args);

const sameAs = (v1: number[]) => (v2: number[]) => {
	return JSON.stringify(v1) === JSON.stringify(v2);
};

const updateCollection = (state: MultiverseData, collectionId: string, data: any) => {
	const { worlds, currentWorldId } = state;
	const world = worlds[currentWorldId];
	const collection = world.collections[collectionId];

	return {
		...state,
		worlds: {
			...worlds,
			[world.id]: {
				...world,
				collections: {
					...world.collections,
					[collectionId]: {
						...collection,
						...data
					}
				}
			}
		}
	};
};

export const multiverseReducer = (
	state: MultiverseData = STATE,
	action: Action
) => {
	const { worlds, currentWorldId } = state;

	if (ActionSetUniverses.validate(action)) {
		return {
			...state,
			universes: ActionSetUniverses.data(action).universeData
		};
	}

	if (ActionAddWorld.validate(action)) {
		const { worldData } = ActionAddWorld.data(action);
		const { worlds, universes } = state;
		const { universeIndex, collections, id } = worldData;
		const universe = universes[universeIndex];

		return {
			...state,
			worlds: {
				...worlds,
				[id]: {
					...worldData,
					maps: universe.maps.reduce((m, map) => (
						{
							...m,
							[map.id]: {
								...map,
								layers: map.layers.map(layer => (
									{
										...layer,
										visible: true,
										opacity: 1
									}
								))
							}
						}
					), {}),
					collections: Object.keys(worldData.collections).reduce((m, key) => {
						return {
							...m,
							[key]: {
								featureCollection: worldData.collections[key],
								selection: []
							}
						};
					}, {}),
					currentMapId: oc(universe.maps[0]).id(''),
					currentCollectionId: Object.keys(collections)[0]
				}
			},
			currentWorldId: id
		};
	}

	if (ActionGoToWorld.validate(action)) {
		return {
			...state,
			currentWorldId: ActionGoToWorld.data(action).worldId
		};
	}

	if (ActionUpdateCoordinates.validate(action)) {
		const { collectionId, entries } = ActionUpdateCoordinates.data(action);
		const { featureCollection } = worlds[currentWorldId].collections[collectionId];

		return updateCollection(state, collectionId, {
			featureCollection: updateCoordinates(featureCollection, entries)
		});
	}

	if (ActionMoveGeometry.validate(action)) {
		const { collectionId, vector, movement } = ActionMoveGeometry.data(action);
		const { featureCollection } = worlds[currentWorldId].collections[collectionId];

		return updateCollection(state, collectionId, {
			featureCollection: moveGeometry(featureCollection, vector, movement)
		});
	}

	if (ActionSelect.validate(action)) {
		const { vector, multi } = ActionSelect.data(action);
		const world = worlds[currentWorldId];
		const { collections, currentCollectionId } = world;
		const { selection } = collections[currentCollectionId];

		return selection.find(sameAs(vector))
			? !multi
				? state
				: updateCollection(state, currentCollectionId, {
					selection: selection.filter(not(sameAs(vector)))
				})
			: updateCollection(state, currentCollectionId, {
				selection: vector.length
					? multi
						? [...selection, vector]
						: [vector]
					: []
			});
	}

	if (ActionClearSelection.validate(action)) {
		const world = worlds[state.currentWorldId];
		const { collections } = world;

		return {
			...state,
			worlds: {
				...state.worlds,
				[state.currentWorldId]: {
					...world,
					collections: Object.keys(collections).reduce((m, key) => (
						{
							...m,
							[key]: {
								...collections[key],
								selection: []
							}
						}
					), {})
				}
			}
		};
	}

	if (ActionClearCollection.validate(action)) {
		const { collectionId } = ActionClearCollection.data(action);

		return updateCollection(state, collectionId, {
			featureCollection: EMPTY_FEATURE_COLLECTION,
			selection: []
		});
	}

	if (ActionAddFeature.validate(action)) {
		const { collectionId, feature } = ActionAddFeature.data(action);
		const { featureCollection, selection } = worlds[currentWorldId].collections[collectionId];

		return updateCollection(state, collectionId, {
			featureCollection: {
				...featureCollection,
				features: featureCollection.features.concat(feature)
			},
			selection: selection.concat([[featureCollection.features.length]])
		});
	}

	if (ActionAddVertex.validate(action)) {
		const { collectionId, coordinate, vector } = ActionAddVertex.data(action);
		const { featureCollection } = worlds[currentWorldId].collections[collectionId];

		return updateCollection(state, collectionId, {
			featureCollection: addAtIndex(featureCollection, vector, coordinate)
		});
	}

	if (ActionSetCollection.validate(action)) {
		const { collectionId } = ActionSetCollection.data(action);

		return {
			...state,
			worlds: {
				...worlds,
				[currentWorldId]: {
					...worlds[currentWorldId],
					currentCollection: collectionId
				}
			}
		};
	}

	if (ActionDeleteSelection.validate(action)) {
		const world = state.worlds[state.currentWorldId];
		const { collections } = world;

		return {
			...state,
			worlds: {
				...state.worlds,
				[state.currentWorldId]: {
					...world,
					collections: Object.keys(collections).reduce((m, key) => {
						const collection = collections[key];

						const fs = collection.selection
							.filter(v => v.length === 1)
							.map(([i]) => i);

						return {
							...m,
							[key]: !collection.selection.length
								? collection
								: {
									featureCollection: {
										...collection.featureCollection,
										features: collection.selection
											.filter(v => v.length > 1)
											.reduce(
												deleteAtIndex,
												collection.featureCollection
											)
											.features
											.filter((f, i) => !fs.includes(i))
									},
									selection: []
								}
						};
					}, {})
				}
			}
		};
	}

	if (ActionSetCollectionData.validate(action)) {
		const { collectionId, featureCollection } = ActionSetCollectionData.data(action);

		return updateCollection(state, collectionId, {
			featureCollection,
			selection: []
		});
	}

	return state;
};
