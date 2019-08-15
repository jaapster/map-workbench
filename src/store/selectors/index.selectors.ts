import { State } from '../../types';
import { createSelector } from 'reselect';

export const zoom = (state: State) => state.mapControl.zoom;

export const mode = (state: State) => state.mapControl.mode;

export const pitch = (state: State) => state.mapControl.pitch;
export const glare = (state: State) => state.mapControl.glare;
export const mouse = (state: State) => state.mapControl.mouse;
export const center = (state: State) => state.mapControl.center;
export const extent = (state: State) => state.mapControl.extent;
export const bearing = (state: State) => state.mapControl.bearing;
export const glareLevel = (state: State) => state.mapControl.glareLevel;
export const overviewOffset = (state: State) => state.mapControl.overviewOffset;
export const overviewVisible = (state: State) => state.mapControl.overviewVisible;

export const worlds = (state: State) => state.multiverse.worlds;
export const universes = (state: State) => state.multiverse.universes;
export const currentMapId = (state: State) => 'defaultMap';
export const currentWorldId = (state: State) => state.multiverse.currentWorldId;
export const projectId = (state: State) => '0000000001';
export const referenceStyles = (state: State) => state.multiverse.referenceLayers;
export const currentReferenceStyleId = (state: State) => state.multiverse.currentReferenceLayer;

export const appPhase = (state: State) => state.system.appPhase;
export const authorized = (state: State) => state.system.authorized;
export const authenticationError = (state: State) => state.system.authenticationError;
export const applicationId = (state: State) => '0000000001';

export const projectPath = createSelector(
	[applicationId, projectId],
	(appId, prjId) => `/api/v2/applications/${ appId }/projects/${ prjId }`
);

export const selectionPath = createSelector(
	[projectPath, currentMapId],
	(prj, mapId) => `${ prj }/maps/${ mapId }/selection`
);

export const scale = (state: State) => state.settings.scale;
export const scales = (state: State) => state.settings.scales;
export const unitSystem = (state: State) => state.settings.unitSystem;

export const language = (state: State) => state.languages.language;
export const languages = (state: State) => state.languages.languagePacks;

export const lang = createSelector(
	[language, languages],
	(language, languages) => (
		languages.find(e => e.id === language) || languages[0]
	)
);

export const currentWorld = createSelector(
	[worlds, currentWorldId, universes],
	(worlds, worldId, universes) => {
		const world = worlds.find(e => e.id === worldId) || worlds[0];
		const { crs, maps } = universes[world.universeIndex];

		return {
			...world,
			crs,
			maps
		};
	}
);

export const crs = (state: State) => currentWorld(state).crs;

export const currentCollectionId = (state: State) => currentWorld(state).currentCollectionId;

export const currentWorldCollections = (state: State) => currentWorld(state).collections;

export const currentCollection = createSelector(
	[currentWorldCollections, currentCollectionId],
	(collections, collectionId) => (
		collections.find(e => e.name === collectionId) || collections[0]
	)
);

export const currentSelectionVectors = (state: State) => currentCollection(state).selection;

export const currentFeatureCollection = (state: State) => currentCollection(state).featureCollection;

export const currentSelectionFeatures = createSelector(
	[currentSelectionVectors, currentFeatureCollection],
	(vectors, featureCollection) => {
		const selection = vectors.map(([i]) => i);
		return featureCollection.features.filter((f, i) => selection.includes(i));
	}
);
