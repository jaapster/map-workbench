import { EPSG, FeatureCollectionData, MapboxStyle } from '../types';

interface WorldData {
	id: string;
	maps: MapData[];
	trails: FeatureCollectionData;
	currentMapId: string;
	universeIndex: number;
}

interface LayerData {
	id: string;
	style: MapboxStyle;
}

interface MapData {
	id: string;
	layers: LayerData[];
	opacity: number;
	visible: boolean;
}

interface UniverseData {
	crs: EPSG;
	maps: MapData[];
	worlds: WorldData[];
}

export class ActionSetUniverses {
	data: {
		universeData: UniverseData[];
	};

	static create(universeData: UniverseData[]) {
		return new ActionSetUniverses(universeData);
	}

	constructor(universeData: UniverseData[]) {
		this.data = {
			universeData
		};
	}
}

export class ActionAddUniverse {
	data: {
		universeData: UniverseData;
	};

	static create(universeData: UniverseData) {
		return new ActionAddUniverse(universeData);
	}

	constructor(universeData: UniverseData) {
		this.data = {
			universeData
		};
	}
}

export class ActionAddWorld {
	data: {
		worldData: WorldData;
	};

	static create(worldData: WorldData) {
		return new ActionAddWorld(worldData);
	}

	constructor(worldData: WorldData) {
		this.data = {
			worldData
		};
	}
}

export type UniverseState = UniverseData[];

const DEFAULT_STATE: UniverseState = [];

export const universeReducer = (state: UniverseState = DEFAULT_STATE, action: any) => {
	if (action instanceof ActionSetUniverses) {
		return action.data.universeData;
	}

	if (action instanceof ActionAddUniverse) {
		state.concat(action.data.universeData);
	}

	if (action instanceof ActionAddWorld) {
		return state.map((u, i) => {
			if (i === action.data.worldData.universeIndex) {
				const worldData = {
					...action.data.worldData,
					maps: [...u.maps]
				};

				return {
					...u,
					worlds: u.worlds
						? u.worlds.concat(worldData)
						: [worldData]
			};
			}

			return u;
		});
	}

	return state;
};
