import {
	Co,
	Dict,
	EPSG,
	FeatureCollectionData, FeatureData,
	MapboxStyle,
	Point
} from '../types';
import { updateCoordinates } from '../models/feature-collection/fn/update-coordinate';
import { moveGeometry } from '../models/feature-collection/fn/move-geometry';
import { addAtIndex } from '../models/feature-collection/fn/add-at-index';
import { deleteAtIndex } from '../models/feature-collection/fn/delete-at-index';

type SelectionVector = number[];

interface Action {
	type: string;
	data: Dict<any>;
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

interface WorldData {
	id: string;
	maps: MapData[];
	trails: {
		featureCollection: FeatureCollectionData;
		selection: SelectionVector[];
	};
	currentMapId: string;
	universeIndex: number;
}

interface UniverseData {
	crs: EPSG;
	maps: MapData[];
	worlds: WorldData[];
}

export interface MultiverseData {
	worlds: Dict<WorldData>;
	universes: UniverseData[];
	currentWorldId: string;
}

export const ActionSetUniverses = {
	create(universeData: UniverseData[]) {
		return {
			type: 'ActionSetUniverses',
			data: {
				universeData
			}
		};
	}
};

export const ActionAddWorld = {
	create(worldData: WorldData) {
		return {
			type: 'ActionAddWorld',
			data: {
				worldData
			}
		};
	}
};

export const ActionGoToWorld = {
	create(worldId: string) {
		return {
			type: 'ActionGoToWorld',
			data: {
				worldId
			}
		};
	}
};

export const ActionUpdateCoordinates = {
	create(entries: [number[], Co][]) {
		return {
			type: 'ActionUpdateCoordinates',
			data: {
				entries
			}
		};
	}
};

export const ActionMoveGeometry = {
	create(vector: SelectionVector, amount: Point) {
		return {
			type: 'ActionMoveGeometry',
			data: {
				vector,
				amount
			}
		};
	}
};

export const ActionSelect = {
	create(vector: SelectionVector, multi: boolean) {
		return {
			type: 'ActionSelect',
			data: {
				vector,
				multi
			}
		};
	}
};

export const ActionClearSelection = {
	create() {
		return {
			type: 'ActionClearSelection',
			data: {}
		};
	}
};

export const ActionAddFeature = {
	create(feature: FeatureData<any>) {
		return {
			type: 'ActionAddFeature',
			data: {
				feature
			}
		};
	}
};

export const ActionAddVertex = {
	create(coordinate: Co, vector: SelectionVector) {
		return {
			type: 'ActionAddFeature',
			data: {
				coordinate,
				vector
			}
		};
	}
};

export const ActionDeleteSelection = {
	create() {
		return {
			type: 'ActionDeleteSelection',
			data: {}
		};
	}
};

const DEFAULT_STATE: MultiverseData = {
	worlds: {},
	universes: [],
	currentWorldId: 'default'
};

export const multiverseReducer = (state: MultiverseData = DEFAULT_STATE, action: Action) => {
	if (action.type === 'ActionSetUniverses') {
		return {
			...state,
			universes: action.data.universeData
		};
	}

	if (action.type === 'ActionAddWorld') {
		const { data: { worldData } } = action;

		return {
			...state,
			worlds: {
				...state.worlds,
				[worldData.id]: {
					...worldData,
					maps: [...state.universes[worldData.universeIndex].maps],
					trails: {
						featureCollection: worldData.trails,
						selection: []
					}
				}
			},
			currentWorldId: worldData.id
		};
	}

	if (action.type === 'ActionGoToWorld') {
		const { data: { worldId } } = action;

		return {
			...state,
			currentWorldId: worldId
		};
	}

	if (action.type === 'ActionUpdateCoordinates') {
		const { data: { entries } } = action;
		const world = state.worlds[state.currentWorldId];

		return {
			...state,
			worlds: {
				...state.worlds,
				[world.id]: {
					...world,
					trails: {
						...world.trails,
						featureCollection: updateCoordinates(
							world.trails.featureCollection,
							entries
						)
					}
				}
			}
		};
	}

	if (action.type === 'ActionMoveGeometry') {
		const { data: { vector, amount } } = action;
		const world = state.worlds[state.currentWorldId];

		return {
			...state,
			worlds: {
				...state.worlds,
				[world.id]: {
					...world,
					trails: {
						...world.trails,
						featureCollection: moveGeometry(
							world.trails.featureCollection,
							vector,
							amount
						)
					}
				}
			}
		};
	}

	if (action.type === 'ActionSelect') {
		const { data: { vector, multi } } = action;
		const world = state.worlds[state.currentWorldId];

		// check if already selected
		const exists = world.trails.selection.find(v => (
			JSON.stringify(v) === JSON.stringify(vector)
		));

		if (exists) {
			return !multi
				// selecting the same thing again
				? state
				: {
					...state,
					worlds: {
						...state.worlds,
						[world.id]: {
							...world,
							trails: {
								...world.trails,
								selection: world.trails.selection.filter(v => (
									JSON.stringify(v) !== JSON.stringify(vector)
								))
							}
						}
					}
				};
		}

		return {
			...state,
			worlds: {
				...state.worlds,
				[world.id]: {
					...world,
					trails: {
						...world.trails,
						selection: vector.length
							? multi
								? [...world.trails.selection, vector]
								: [vector]
							: []
					}
				}
			}
		};
	}

	if (action.type === 'ActionClearSelection') {
		const world = state.worlds[state.currentWorldId];

		return {
			...state,
			worlds: {
				...state.worlds,
				[world.id]: {
					...world,
					trails: {
						...world.trails,
						selection: []
					}
				}
			}
		};
	}

	if (action.type === 'ActionAddFeature') {
		const { data: { feature } } = action;
		const world = state.worlds[state.currentWorldId];

		return {
			...state,
			worlds: {
				...state.worlds,
				[world.id]: {
					...world,
					trails: {
						...world.trails,
						featureCollection: {
							...world.trails.featureCollection,
							features: world.trails.featureCollection.features.concat(feature)
						}
					}
				}
			}
		};
	}

	if (action.type === 'ActionAddVertex') {
		const { data: { coordinate, vector } } = action;
		const world = state.worlds[state.currentWorldId];

		return {
			...state,
			worlds: {
				...state.worlds,
				[world.id]: {
					...world,
					trails: {
						...world.trails,
						featureCollection: addAtIndex(
							world.trails.featureCollection,
							vector,
							coordinate
						)
					}
				}
			}
		};
	}

	if (action.type === 'ActionDeleteSelection') {
		return {
			...state,
			worlds: Object.keys(state.worlds).reduce((w, key) => {
				const world = state.worlds[key];
				const { id, trails: { selection, featureCollection } } = world;

				if (id !== state.currentWorldId) {
					return {
						...w,
						[id]: world
					};
				}

				const fs = selection.filter(v => v.length === 1).map(([i]) => i);

				return {
					...w,
					[world.id]: {
						...world,
						trails: {
							featureCollection: {
								...featureCollection,
								features: selection
									.filter(v => v.length > 1)
									.reduce(deleteAtIndex, featureCollection)
									.features
									.filter((f, i) => !fs.includes(i))
							},
							selection: []
						}
					}
				};
			}, {})
		};
	}

	return state;
};
