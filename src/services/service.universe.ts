import { Dict } from '../types';
import { World } from '../models/model.world';
import { Universe } from '../models/model.universe';
import { MessageService } from './service.message';
import { MapControl } from '../map-control/map-control';

import {
	ActionAddWorld,
	ActionSetUniverses
} from '../reducers/reducer.multiverse';
import { dispatch } from '../reducers/store';

const worlds: Dict<World> = {};
let universes: Universe[] = [];

let currentWorld: string;


export const UniverseService = {
	addWorld(props: any) {
		dispatch(ActionAddWorld.create(props));

		const { id, trails, universeIndex } = props;

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

		dispatch(ActionSetUniverses.create(data));

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
