import { oc } from 'ts-optchain';
import { addAtIndex } from './fn/add-at-index';
import { moveGeometry } from './fn/move-geometry';
import { deleteAtIndex } from './fn/delete-at-index';
import { MultiverseData } from '../types';
import { updateCoordinates } from './fn/update-coordinate';
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
	ActionDeleteSelection,
	ActionUpdateCoordinates,
	ActionSetCollectionData,
	ActionSetReferenceLayers,
	ActionSetCurrentReferenceLayer } from './actions';

const STATE: MultiverseData = {
	worlds: [],
	universes: [],
	currentWorldId: 'default',
	referenceLayers: [],
	currentReferenceLayer: 'Empty'
};

const not = (fn: (...args: any[]) => any) => (...args: any[]) => !fn(...args);

const sameAs = (v1: number[]) => (v2: number[]) => {
	return JSON.stringify(v1) === JSON.stringify(v2);
};

export const multiverseReducer = (
	state: MultiverseData = STATE,
	action: Action
): MultiverseData => {
	const { worlds, currentWorldId } = state;

	if (ActionSetUniverses.validate(action)) {
		return {
			...state,
			universes: ActionSetUniverses.data(action).universeData
		};
	}

	if (ActionSetReferenceLayers.validate(action)) {
		return {
			...state,
			referenceLayers: ActionSetReferenceLayers.data(action).layers
		};
	}

	if (ActionSetCurrentReferenceLayer.validate(action)) {
		return {
			...state,
			currentReferenceLayer: ActionSetCurrentReferenceLayer.data(action).layer
		};
	}

	if (ActionAddWorld.validate(action)) {
		const { worldData } = ActionAddWorld.data(action);
		const { worlds, universes } = state;
		const { universeIndex, collections, id } = worldData;
		const universe = universes[universeIndex];

		return {
			...state,
			worlds: [
				...worlds,
				{
					...worldData,
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
			],
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

		return {
			...state,
			worlds: worlds.map(world => world.id === currentWorldId
				? {
					...world,
					collections: {
						...world.collections,
						[collectionId]: {
							...world.collections[collectionId],
							featureCollection: updateCoordinates(world.collections[collectionId].featureCollection, entries)
						}
					}
				}
				: world
			)
		};
	}

	if (ActionMoveGeometry.validate(action)) {
		const { collectionId, vector, movement } = ActionMoveGeometry.data(action);

		return {
			...state,
			worlds: worlds.map(world => world.id === currentWorldId
				? {
					...world,
					collections: {
						...world.collections,
						[collectionId]: {
							...world.collections[collectionId],
							featureCollection: moveGeometry(
								world.collections[collectionId].featureCollection,
								vector,
								movement
							)
						}
					}
				}
				: world
			)
		};
	}

	if (ActionSelect.validate(action)) {
		const world = worlds.find(world => world.id === currentWorldId);

		if (!world) {
			return state;
		}

		const { vector, multi } = ActionSelect.data(action);
		const { collections, currentCollectionId } = world;
		const { selection } = collections[currentCollectionId];

		return selection.find(sameAs(vector))
			? !multi
				? state
				: {
					...state,
					worlds: worlds.map(world => world.id === currentWorldId
						? {
							...world,
							collections: {
								...world.collections,
								[world.currentCollectionId]: {
									...world.collections[world.currentCollectionId],
									selection: world.collections[world.currentCollectionId].selection.filter(not(sameAs(vector)))
								}
							}
						}
						: world
					)
				}
			: {
				...state,
				worlds: worlds.map(world => world.id === currentWorldId
					? {
						...world,
						collections: {
							...world.collections,
							[world.currentCollectionId]: {
								...world.collections[world.currentCollectionId],
								selection: vector.length
									? multi
										? [...selection, vector]
										: [vector]
									: []
							}
						}
					}
					: world
				)
			};
	}

	if (ActionClearSelection.validate(action)) {
		return {
			...state,
			worlds: worlds.map((world) => {
				if (world.id === currentWorldId) {
					return {
						...world,
						collections: Object.keys(world.collections).reduce((m, key) => (
							{
								...m,
								[key]: {
									...world.collections[key],
									selection: []
								}
							}
						), {})
					};
				}

				return world;
			})
		};
	}

	if (ActionAddFeature.validate(action)) {
		const { collectionId, feature } = ActionAddFeature.data(action);

		return {
			...state,
			worlds: worlds.map(world => world.id === currentWorldId
				? {
					...world,
					collections: {
						...world.collections,
						[collectionId]: {
							...world.collections[collectionId],
							featureCollection: {
								...world.collections[collectionId].featureCollection,
								features: world.collections[collectionId].featureCollection.features.concat(feature)
							},
							selection: world.collections[collectionId].selection.concat(
								[[world.collections[collectionId].featureCollection.features.length]]
							)
						}
					}
				}
				: world
			)
		};
	}

	if (ActionAddVertex.validate(action)) {
		const { collectionId, coordinate, vector } = ActionAddVertex.data(action);

		return {
			...state,
			worlds: worlds.map(world => world.id === currentWorldId
				? {
					...world,
					collections: {
						...world.collections,
						[collectionId]: {
							...world.collections[collectionId],
							featureCollection: addAtIndex(
								world.collections[collectionId].featureCollection,
								vector,
								coordinate
							)
						}
					}
				}
				: world
			)
		};
	}

	if (ActionSetCollection.validate(action)) {
		const { collectionId } = ActionSetCollection.data(action);

		return {
			...state,
			worlds: worlds.map((world) => {
				if (world.id === currentWorldId) {
					return {
						...world,
						currentCollectionId: collectionId
					};
				}

				return world;
			})
		};
	}

	if (ActionDeleteSelection.validate(action)) {
		return {
			...state,
			worlds: worlds.map(world => world.id === currentWorldId
				? {
					...world,
					collections: Object.keys(world.collections).reduce((m, key) => {
						const collection = world.collections[key];

						const fs = collection.selection
							.filter(v => v.length === 1)
							.map(([i]) => i);

						// todo: fix bug caused by wrong indices due to
						//  previously deleted siblings
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
									selection: collection.selection.reduce((m: any, v) => {
										if (v.length === 1) {
											return m;
										}

										return m.concat([[v[0]]]);
									}, [])
								}
						};
					}, {})
				}
				: world
			)
		};
	}

	if (ActionSetCollectionData.validate(action)) {
		const { collectionId, featureCollection } = ActionSetCollectionData.data(action);

		return {
			...state,
			worlds: worlds.map(world => world.id === currentWorldId
				? {
					...world,
					collections: {
						...world.collections,
						[collectionId]: {
							...world.collections[collectionId],
							featureCollection
						}
					}
				}
				: world
			)
		};
	}

	return state;
};
