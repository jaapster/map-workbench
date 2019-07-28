import { ServiceGeoNote } from './service.geo-note';
import { EventEmitter } from '../event-emitter';
import { UniverseService } from './service.universe';
import { MessageService } from './service.message';

const eventEmitter = new EventEmitter();

export const SelectionService = {
	on: eventEmitter.on,
	off: eventEmitter.off,

	clearSelection() {
		[
			UniverseService.getCurrentWorld().trails,
			ServiceGeoNote.getModel()
		].forEach(m => m.clearSelection());
	},

	deleteSelection() {
		[
			UniverseService.getCurrentWorld().trails,
			ServiceGeoNote.getModel()
		].forEach(m => m.deleteSelection());
	},

	getSelection() {
		return [
			UniverseService.getCurrentWorld().trails,
			ServiceGeoNote.getModel()
		].reduce((m1, model) => m1.concat(model.getSelectedFeatures()), [] as any);
	}
};

const emitMessage = () => {
	eventEmitter.trigger('update:selection');
};

MessageService.on('update:world', () => {
	UniverseService.getWorlds().forEach(world => (
		world.trails.off('update', emitMessage)
	));

	const currentWorld = UniverseService.getCurrentWorld();

	if (currentWorld) {
		currentWorld.trails.on('update', emitMessage);
	}

	eventEmitter.trigger('update:selection');
});
