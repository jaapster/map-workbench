import { createSelector } from 'reselect';
import { State } from '../../types';

export const crs = (state: State) => state.mapControl.CRS;

export const zoom = (state: State) => state.mapControl.zoom;

export const mode = (state: State) => state.mapControl.mode;

export const worlds = (state: State) => state.multiverse.worlds;

export const center = (state: State) => state.mapControl.center;

export const appPhase = (state: State) => state.appPhase;

export const universes = (state: State) => state.multiverse.universes;

export const currentWorldId = (state: State) => state.multiverse.currentWorldId;

export const currentWorld = createSelector(
	[worlds, currentWorldId, universes],
	(worlds, worldId, universes) => {
		const world = worlds[worldId];
		const universe = universes[world.universeIndex];

		return {
			...world,
			crs: universe.crs,
			maps: universe.maps
		};
	}
);

export const currentCollectionId = (state: State) => currentWorld(state).currentCollectionId;

export const currentWorldCollections = (state: State) => currentWorld(state).collections;

export const currentCollection = (state: State) => currentWorldCollections(state)[currentCollectionId(state)];

export const currentSelectionVectors = (state: State) => currentCollection(state).selection;

export const currentFeatureCollection = (state: State) => currentCollection(state).featureCollection;

export const currentSelectionFeatures = createSelector(
	[currentSelectionVectors, currentFeatureCollection],
	(vectors, featureCollection) => {
		const selection = vectors.map(([i]) => i);
		return featureCollection.features.filter((f, i) => selection.includes(i));
	}
);
