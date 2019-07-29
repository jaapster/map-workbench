import { Action } from './actions';
import { addAtIndex } from '../models/feature-collection/fn/add-at-index';
import { moveGeometry } from '../models/feature-collection/fn/move-geometry';
import { deleteAtIndex } from '../models/feature-collection/fn/delete-at-index';
import { MultiverseData } from '../types';
import { updateCoordinates } from '../models/feature-collection/fn/update-coordinate';
import { EMPTY_FEATURE_COLLECTION } from '../constants';
import {
	ActionSelect,
	ActionAddWorld,
	ActionAddVertex,
	ActionGoToWorld,
	ActionAddFeature,
	ActionMoveGeometry,
	ActionSetUniverses,
	ActionClearSelection,
	ActionClearCollection,
	ActionDeleteSelection,
	ActionUpdateCoordinates } from './actions';

const DEFAULT_STATE: MultiverseData = {
	worlds: {},
	universes: [],
	currentWorldId: 'default'
};

const sameVector = (v1: number[], v2: number[]) => {
	return JSON.stringify(v1) === JSON.stringify(v2);
};

export const multiverseReducer = (state: MultiverseData = DEFAULT_STATE, action: Action) => {
	if (ActionSetUniverses.validate(action)) {
		return {
			...state,
			universes: ActionSetUniverses.data(action).universeData
		};
	}

	if (ActionAddWorld.validate(action)) {
		const { worldData } = ActionAddWorld.data(action);
		const { worlds, universes } = state;

		return {
			...state,
			worlds: {
				...worlds,
				[worldData.id]: {
					...worldData,
					maps: [...universes[worldData.universeIndex].maps]
				}
			},
			currentWorldId: worldData.id
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
		const { worlds, currentWorldId } = state;
		const world = worlds[currentWorldId];
		const collection = world.collections[collectionId];

		return {
			...state,
			worlds: {
				...worlds,
				[world.id]: {
					...world,
					features: {
						...world.collections,
						[collectionId]: {
							...collection,
							featureCollection: updateCoordinates(
								collection.featureCollection,
								entries
							)
						}
					}
				}
			}
		};
	}

	if (ActionMoveGeometry.validate(action)) {
		const { collectionId, vector, amount } = ActionMoveGeometry.data(action);
		const { worlds, currentWorldId } = state;
		const world = worlds[currentWorldId];
		const collection = world.collections[collectionId];

		return {
			...state,
			worlds: {
				...worlds,
				[world.id]: {
					...world,
					features: {
						...world.collections,
						[collectionId]: {
							...collection,
							featureCollection: moveGeometry(
								collection.featureCollection,
								vector,
								amount
							)
						}
					}
				}
			}
		};
	}

	if (ActionSelect.validate(action)) {
		const { collectionId, vector, multi } = ActionSelect.data(action);
		const { worlds, currentWorldId } = state;
		const world = worlds[currentWorldId];
		const collection = world.collections[collectionId];

		// check if already selected
		const exists = collection.selection.find(v => sameVector(v, vector));

		if (exists) {
			return !multi
				// selecting the same thing again
				? state
				: {
					...state,
					worlds: {
						...worlds,
						[world.id]: {
							...world,
							features: {
								...world.collections,
								[collectionId]: {
									...collection,
									selection: collection.selection.filter(v => (
										!sameVector(v, vector)
									))
								}
							}
						}
					}
				};
		}

		return {
			...state,
			worlds: {
				...worlds,
				[world.id]: {
					...world,
					features: {
						...world.collections,
						[collectionId]: {
							...collection,
							selection: vector.length
								? multi
									? [...collection.selection, vector]
									: [vector]
								: []
						}
					}
				}
			}
		};
	}

	if (ActionClearSelection.validate(action)) {
		const { collectionId } = ActionClearSelection.data(action);
		const { worlds, currentWorldId } = state;
		const world = worlds[currentWorldId];
		const collection = world.collections[collectionId];

		return {
			...state,
			worlds: {
				...worlds,
				[world.id]: {
					...world,
					features: {
						...world.collections,
						[collectionId]: {
							...collection,
							selection: []
						}
					}
				}
			}
		};
	}

	if (ActionClearCollection.validate(action)) {
		const { collectionId } = ActionClearCollection.data(action);
		const { worlds, currentWorldId } = state;
		const world = worlds[currentWorldId];

		return {
			...state,
			worlds: {
				...worlds,
				[world.id]: {
					...world,
					features: {
						...world.collections,
						[collectionId]: {
							featureCollection: EMPTY_FEATURE_COLLECTION,
							selection: []
						}
					}
				}
			}
		};
	}

	if (ActionAddFeature.validate(action)) {
		const { collectionId, feature } = ActionAddFeature.data(action);
		const { worlds, currentWorldId } = state;
		const world = worlds[currentWorldId];
		const collection = world.collections[collectionId];

		return {
			...state,
			worlds: {
				...worlds,
				[world.id]: {
					...world,
					features: {
						...world.collections,
						[collectionId]: {
							...collection,
							featureCollection: {
								...collection.featureCollection,
								features: collection.featureCollection.features.concat(feature)
							}
						}
					}
				}
			}
		};
	}

	if (ActionAddVertex.validate(action)) {
		const { collectionId, coordinate, vector } = ActionAddVertex.data(action);
		const { worlds, currentWorldId } = state;
		const world = worlds[currentWorldId];
		const collection = world.collections[collectionId];

		return {
			...state,
			worlds: {
				...worlds,
				[world.id]: {
					...world,
					features: {
						...world.collections,
						[collectionId]: {
							...collection,
							featureCollection: addAtIndex(
								collection.featureCollection,
								vector,
								coordinate
							)
						}
					}
				}
			}
		};
	}

	if (ActionDeleteSelection.validate(action)) {
		const { collectionId } = ActionDeleteSelection.data(action);
		const { worlds, currentWorldId } = state;

		return {
			...state,
			worlds: Object.keys(worlds).reduce((w, key) => {
				const world = worlds[key];
				const collection = world.collections[collectionId];

				if (world.id !== currentWorldId) {
					return {
						...w,
						[world.id]: world
					};
				}

				const fs = collection.selection
					.filter(v => v.length === 1)
					.map(([i]) => i);

				return {
					...w,
					[world.id]: {
						...world,
						features: {
							...world.collections,
							[collectionId]: {
								featureCollection: {
									...collection.featureCollection,
									features: collection.selection
										.filter(v => v.length > 1)
										.reduce(deleteAtIndex, collection.featureCollection)
										.features
										.filter((f, i) => !fs.includes(i))
								},
								selection: []
							}
						}
					}
				};
			}, {})
		};
	}

	return state;
};
