import { oc } from 'ts-optchain';
import { State } from 'se';
import { getState } from 'lite/store/store';
import { GEOGRAPHIC } from 'lite/constants';
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

export const worldSettings = (state: State) => state.multiverse.worlds;
export const currentWorldId = (state: State) => state.multiverse.currentWorldId;
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
	(maps, styles): any[] => maps.map((map) => {
		return {
			...map,
			layers: map.layers.map((layer) => {
				const style = styles.find(style => style.name === layer.name);

				return style
					? {
						...layer,
						style
					}
					: layer;
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

export const currentWorld = createSelector(
	[currentWorldId, currentWorldInfo, currentWorldSettings, maps, universes],
	(id, info, settings, maps, universes) => {
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
			universe: universes[info.universeIndex],
			maps: universeMaps
		};
	}
);

export const currentlyVisibleLayers = createSelector(
	[currentWorld],
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

export const currentCRS = createSelector(
	[currentWorld],
	world => world ? world.currentCRS : GEOGRAPHIC
);

export const currentCollectionId = createSelector(
	[currentWorld],
	world => world ? world.currentCollectionId : 'trails'
);

export const currentWorldCollections = createSelector(
	[currentWorld],
	world => world ? world.collections : []
);

export const currentMapId = createSelector(
	[currentWorld],
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

export const serviceProviders = (state: State) => state.server.serviceProviders;

export const referenceStyles = createSelector(
	[serviceProviders],
	serviceProviders => (
		serviceProviders.tileProviders.reduce((m, p) => (
			m.concat(p.modes.map((mode) => ([
				`${ p.name } - ${ mode.name }`,
				p.type === 'vector'
					// type is 'vector': assume this is a mapbox style definition url
					? mode.servers[0]
					// type is 'raster': create a valid mapbox style for raster tile providers
					: {
						version: 8,
						// todo: create our own glyph fallback
						glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
						sources: {
							[mode.name]: {
								type: 'raster',
								tiles: mode.servers.map(s =>
									// todo: change xy placeholders to z, x, y and quadkey, not 0, 1, 2 and 3
									s.replace(/{(\d)}/g, (c, s) => `{${ ['z', 'x', 'y', 'quadkey'][s] }}`)
								),
								tileSize: 256
							}
						},
						layers: [
							{
								id: mode.name,
								type: 'raster',
								source: mode.name
							}
						]
					}
			])))
		), [] as any)
	)
);

// @ts-ignore
window.world = () => currentWorld(getState());
