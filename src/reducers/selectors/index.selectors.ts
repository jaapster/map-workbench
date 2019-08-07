import { createSelector } from 'reselect';
import { State } from '../../types';

export const zoom = (state: State) => state.mapControl.zoom;

export const bearing = (state: State) => state.mapControl.bearing;

export const pitch = (state: State) => state.mapControl.pitch;

export const mode = (state: State) => state.mapControl.mode;

export const worlds = (state: State) => state.multiverse.worlds;

export const worldIdsString = (state: State) => Object.keys(worlds(state)).join(',');

export const worldIds = createSelector([worldIdsString], str => str.split(','));

export const referenceStyles = (state: State) => state.multiverse.referenceLayers;

export const currentReferenceStyleId = (state: State) => state.multiverse.currentReferenceLayer;

export const overviewVisible = (state: State) => state.mapControl.overviewVisible;

export const glare = (state: State) => state.mapControl.glare;

export const center = (state: State) => state.mapControl.center;

export const extent = (state: State) => state.mapControl.extent;

export const appPhase = (state: State) => state.appPhase;

export const universes = (state: State) => state.multiverse.universes;

export const currentWorldId = (state: State) => state.multiverse.currentWorldId;

export const unitSystem = (state: State) => state.settings.unitSystem;

export const language = (state: State) => state.i18n.language;

export const languages = (state: State) => state.i18n.languages;

export const languageIds = (state: State) => state.i18n.languageIds;

export const languageOptions = (state: State) => state.i18n.languageOptions;

export const lang = createSelector(
	[language, languages],
	(language, languages) => {
		return languages[language];
	}
);

export const scale = (state: State) => state.settings.UIScale;

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

export const crs = (state: State) => currentWorld(state).crs;

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
