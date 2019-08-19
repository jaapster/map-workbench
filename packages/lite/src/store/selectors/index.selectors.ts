import { State } from 'se';
import { createSelector } from 'reselect';
import { getState } from 'lite/store/store';
import { oc } from 'ts-optchain';
import { GEOGRAPHIC } from 'lite/constants';

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

export const worldSettings = (state: State) => state.multiverse.worlds;
export const currentWorldId = (state: State) => state.multiverse.currentWorldId;
export const referenceStyles = (state: State) => state.multiverse.referenceLayers;
export const currentReferenceStyleId = (state: State) => state.multiverse.currentReferenceLayer;

export const appId = (state: State) => state.system.appId;
export const appPhase = (state: State) => state.system.appPhase;
export const authorized = (state: State) => state.system.authorized;
export const authenticationError = (state: State) => state.system.authenticationError;

export const universes = (state: State) => state.project.universes;
export const projectId = (state: State) => state.project.id;
export const worldInfos = (state: State) => state.project.worlds;
export const mapDefinitions = (state: State) => state.project.mapDefinitions;

export const scale = (state: State) => state.settings.scale;
export const scales = (state: State) => state.settings.scales;
export const unitSystem = (state: State) => state.settings.unitSystem;

export const vectorStyles = (state: State) => state.vectorStyles;

export const language = (state: State) => state.languages.language;
export const languages = (state: State) => state.languages.languagePacks;

export const lang = createSelector(
	[language, languages],
	(language, languages) => (
		languages.find(e => e.id === language) || languages[0]
	)
);

export const maps = createSelector(
	[mapDefinitions, vectorStyles],
	(maps, vectors): any[] => maps.map((map) => {
		return {
			...map,
			layers: map.layers.map((layer) => {
				const vectorStyle = vectors.find(vector => vector.name === layer.name);

				if (vectorStyle) {
					return {
						...layer,
						style: vectorStyle
					};
				}

				return layer;
			})
		};
	})
);

export const currentWorldInfo = createSelector(
	[currentWorldId, worldInfos],
	(id, worlds) => worlds.find(world => world.id === id)
);

export const currentWorldSettings = createSelector(
	[currentWorldId, worldSettings],
	(id, worlds) => worlds.find(world => world.id === id)
);

export const world = createSelector(
	[currentWorldId, currentWorldInfo, currentWorldSettings, maps],
	(id, info, settings, maps) => {
		if (info == null || settings == null) {
			return null;
		}

		const universeMaps = maps.filter(map => (
			(info.universeIndex === 0 && map.universeIndex == null) ||
			info.universeIndex === map.universeIndex
		));

		return {
			...info,
			...settings,
			maps: universeMaps
		};
	}
);

export const visibleLayers = createSelector(
	[world],
	(world) => {
		if (!world) {
			return [];
		}

		const map = world.maps.find(map => map.name === world.currentMapId);

		if (!map) {
			return [];
		}

		// @ts-ignore
		const mapSettings = world.maps[world.currentMapId];

		return map.layers
			.filter((layer: any) => oc(mapSettings).layers[layer.name].visible(true))
			.map((layer: any) => layer.style.modes[oc(mapSettings).layers[layer.name].mode(0)].style);
	}
);

export const crs = createSelector(
	[world],
	world => world ? world.currentCRS : GEOGRAPHIC
);

export const currentCollectionId = createSelector(
	[world],
	world => world ? world.currentCollectionId : 'trails'
);

export const currentWorldCollections = createSelector(
	[world],
	world => world ? world.collections : []
);

export const currentMapId = createSelector(
	[world],
	world => world ? world.currentMapId : ''
);

export const currentCollection = createSelector(
	[currentWorldCollections, currentCollectionId],
	(collections, collectionId) => collections.find(e => e.name === collectionId) || collections[0]
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

export const projectPath = createSelector(
	[appId, projectId],
	(appId, projectId) => `/api/v2/applications/${ appId }/projects/${ projectId }`
);

export const selectionPath = createSelector(
	[projectPath, currentMapId],
	(projectPath, currentMapId) => `${ projectPath }/maps/${ currentMapId }/selection`
);

// @ts-ignore
window.world = () => world(getState());
