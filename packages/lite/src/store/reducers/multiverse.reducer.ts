import { addAtIndex } from './fn/add-at-index';
import { GEOGRAPHIC } from 'lite/constants';
import { moveGeometry } from './fn/move-geometry';
import { deleteAtIndex } from './fn/delete-at-index';
import { MultiverseData } from 'se';
import { updateCoordinates } from './fn/update-coordinate';
import {
	Action,
	ActionSelect,
	ActionAddWorld,
	ActionAddVertex,
	ActionGoToWorld,
	ActionAddFeature,
	ActionMoveGeometry,
	ActionSetCollection,
	ActionClearSelection,
	ActionDeleteSelection,
	ActionUpdateCoordinates,
	ActionSetCollectionData,
	ActionSetReferenceLayers,
	ActionSetCurrentReferenceLayer, ActionToggleLayerVisibility, ActionSetCurrentMap
} from 'lite/store/actions/actions';
import { act } from 'react-dom/test-utils';

const STATE: MultiverseData = {
	worlds: [{
		id: 'default',
		maps: {},
		mapSettings: {},
		collections: [{
			name: 'trails',
			featureCollection: {
				type: 'FeatureCollection',
				features: []
			},
			selection: []
		}],
		currentCRS: GEOGRAPHIC,
		currentMapId: 'default',
		currentCollectionId: 'trails'
	}],
	currentWorldId: 'default',
	referenceLayers: [],
	currentReferenceLayer: 'Empty'
};

export const multiverseReducer = (state: MultiverseData = STATE, action: Action): MultiverseData => {
	const { worlds, currentWorldId } = state;

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
		const {
			worldData,
			worldData: {
				id,
				collections
			}
		} = ActionAddWorld.data(action);

		return {
			...state,
			worlds: worlds.concat(
				{
					...worldData,
					currentMapId: '',
					currentCollectionId: collections[0].name

				}
			),
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
		const {
			entries,
			collectionId
		} = ActionUpdateCoordinates.data(action);

		return {
			...state,
			worlds: worlds.map(world => (
				world.id === currentWorldId
					? {
						...world,
						collections: world.collections.map(collection => (
							collection.name === collectionId
								? {
									...collection,
									featureCollection: updateCoordinates(
										collection.featureCollection,
										entries
									)
								}
								: collection
						))
					}
					: world
			))
		};
	}

	if (ActionMoveGeometry.validate(action)) {
		const {
			vector,
			movement,
			collectionId
		} = ActionMoveGeometry.data(action);

		return {
			...state,
			worlds: worlds.map(world => (
				world.id === currentWorldId
					? {
						...world,
						collections: world.collections.map(collection => (
							collection.name === collectionId
								? {
									...collection,
									featureCollection: moveGeometry(
										collection.featureCollection,
										vector,
										movement
									)
								}
								: collection
						))
					}
					: world
			))
		};
	}

	if (ActionSelect.validate(action)) {
		const world = worlds.find(world => world.id === currentWorldId);

		if (!world) {
			return state;
		}

		const { vector, multi } = ActionSelect.data(action);
		const { collections, currentCollectionId } = world;

		const collection = collections.find(collection => collection.name === currentCollectionId);

		if (!collection) {
			return state;
		}

		const { selection } = collection;

		return selection.find(v => v.join() === vector.join())
			? !multi
				? state
				: {
					...state,
					worlds: worlds.map(world => (
						world.id === currentWorldId
							? {
								...world,
								collections: world.collections.map(collection => (
									collection.name === currentCollectionId
										? {
											...collection,
											selection: collection.selection.filter(
												v => v.join() !== vector.join()
											)
										}
										: collection
								))
							}
							: world
					))
				}
			: {
				...state,
				worlds: worlds.map(world => (
					world.id === currentWorldId
						? {
							...world,
							collections: world.collections.map(collection => (
								collection.name === currentCollectionId
									? {
										...collection,
										selection: vector.length
											? multi
												? [...selection, vector]
												: [vector]
											: []
									}
									: collection
							))
						}
						: world
				))
			};
	}

	if (ActionClearSelection.validate(action)) {
		return {
			...state,
			worlds: worlds.map(world => (
				world.id === currentWorldId
					? {
						...world,
						collections: world.collections.map(collection => (
							{
								...collection,
								selection: []
							}
						))
					}
					: world
			))
		};
	}

	if (ActionAddFeature.validate(action)) {
		const {
			feature,
			collectionId
		} = ActionAddFeature.data(action);

		return {
			...state,
			worlds: worlds.map(world => (
				world.id === currentWorldId
					? {
						...world,
						collections: world.collections.map(collection => (
							collection.name === collectionId
								? {
									...collection,
									featureCollection: {
										...collection.featureCollection,
										features: collection.featureCollection.features.concat(feature)
									},
									selection: collection.selection.concat(
										[[collection.featureCollection.features.length]]
									)
								}
								: collection
						))
					}
					: world
			))
		};
	}

	if (ActionAddVertex.validate(action)) {
		const {
			vector,
			coordinate,
			collectionId
		} = ActionAddVertex.data(action);

		return {
			...state,
			worlds: worlds.map(world => (
				world.id === currentWorldId
					? {
						...world,
						collections: world.collections.map(collection => (
							collection.name === collectionId
								? {
									...collection,
									featureCollection: addAtIndex(
										collection.featureCollection,
										vector,
										coordinate
									)
								}
								: collection
						))
					}
					: world
			))
		};
	}

	if (ActionSetCollection.validate(action)) {
		const {
			collectionId
		} = ActionSetCollection.data(action);

		return {
			...state,
			worlds: worlds.map(world => (
				world.id === currentWorldId
					? {
						...world,
						currentCollectionId: collectionId
					}
					: world
			))
		};
	}

	if (ActionDeleteSelection.validate(action)) {
		return {
			...state,
			worlds: worlds.map(world => (
				world.id === currentWorldId
					? {
						...world,
						collections: world.collections.map((collection) => {
							const fs = collection.selection
								.filter(v => v.length === 1)
								.map(([i]) => i);

							// todo: fix bug caused by wrong indices due to
							//  previously deleted siblings
							return !collection.selection.length
								? collection
								: {
									...collection,
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
								};
						})
					}
					: world
			))
		};
	}

	if (ActionSetCollectionData.validate(action)) {
		const {
			collectionId,
			featureCollection
		} = ActionSetCollectionData.data(action);

		return {
			...state,
			worlds: worlds.map(world => (
				world.id === currentWorldId
					? {
						...world,
						collections: world.collections.map(collection => (
							collection.name === collectionId
								? {
									...collection,
									featureCollection
								}
								: collection
						))
					}
					: world
			))
		};
	}

	if (ActionSetCurrentMap.validate(action)) {
		return {
			...state,
			worlds: worlds.map(world => (
				world.id === currentWorldId
					? {
						...world,
						currentMapId: ActionSetCurrentMap.data(action).mapId
					}
					: world
			))
		};
	}

	if (ActionToggleLayerVisibility.validate(action)) {
		const { layerId } = ActionToggleLayerVisibility.data(action);

		return {
			...state,
			worlds: worlds.map(world => (
				world.id === currentWorldId
					? {
						...world,
						mapSettings: {
							...world.mapSettings,
							[world.currentMapId]: world.mapSettings[world.currentMapId]
								? {
									...world.mapSettings[world.currentMapId],
									[layerId]: world.mapSettings[world.currentMapId][layerId]
										? {
											...world.mapSettings[world.currentMapId][layerId],
											visible: !world.mapSettings[world.currentMapId][layerId].visible
										}
										: {
											visible: false,
											opacity: 1
										}
								}
								: {
									[layerId]: {
										visible: false,
										opacity: 1
									}
								}
						}
					}
					: world
			))
		};
	}

	return state;
};
