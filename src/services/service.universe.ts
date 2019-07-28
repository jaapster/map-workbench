import { Dict } from '../types';
import { World } from '../models/model.world';
import { Universe } from '../models/model.universe';
import { MessageService } from './service.message';
import { MapControl } from '../map-control/map-control';

import {
	universeReducer,
	ActionSetUniverses,
	ActionAddWorld,
	UniverseState
} from '../reducers/reducers.universe';

const worlds: Dict<World> = {};
let universes: Universe[] = [];

let currentWorld: string;

let state: { universes: UniverseState} = {
	universes: []
};

export const UniverseService = {
	addWorld(props: any) {
		const { id, trails, universeIndex } = props;

		state = {
			universes: universeReducer(state.universes, ActionAddWorld.create(props))
		};

		console.log(state); // remove me

		if (!worlds[id]) {
			worlds[id] = World.create({
				id,
				trails,
				universe: universes[universeIndex]
			});
		}

		UniverseService.setCurrentWorld(id);
	},

	hasWorld(id: string) {
		return id in worlds;
	},

	getCurrentWorld() {
		return worlds[currentWorld];
	},

	setCurrentWorld(id: string) {
		currentWorld = id;

		MessageService.trigger('update:world');

		if (MapControl.instance) {
			MapControl.instance.setCRS(worlds[currentWorld].CRS);
			MapControl.setLocation(worlds[currentWorld].location);
		}
	},

	getWorld(id: string) {
		return worlds[id];
	},

	getWorlds() {
		return Object.keys(worlds).map(key => worlds[key]);
	},

	init(data: any) {
		universes = data.map(Universe.create);

		state = {
			universes: universeReducer(state.universes, ActionSetUniverses.create(data))
		};

		const up = () => {
			UniverseService.getCurrentWorld().setLocation({
				zoom: MapControl.instance.getZoom(),
				// @ts-ignore
				center: MapControl.instance.getCenter(),
				// @ts-ignore
				epsg: MapControl.instance.getCRS()
			});
		};

		MessageService.on('update:zoom', up);
		MessageService.on('update:center', up);
	}
};
