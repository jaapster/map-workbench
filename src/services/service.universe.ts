import { Dict } from '../types';
import { World } from '../models/model.world';
import { Universe } from '../models/model.universe';
import { MessageService } from './service.message';

const worlds: Dict<World> = {};

let universes: Universe[];
let currentWorld: string;

export const UniverseService = {
	addWorld(props: any) {
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
	},

	init(universeData: any) {
		universes = universeData.map(Universe.create);
	}
};
