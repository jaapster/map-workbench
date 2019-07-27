import { ServiceGeoNote } from './service.geo-note';
import { EventEmitter } from '../event-emitter';
import { UniverseService } from './service.universe';

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

setTimeout(() => {
	[
		UniverseService.getCurrentWorld().trails,
		ServiceGeoNote.getModel()
	].forEach(m => m.on('update:selection', () => eventEmitter.trigger('update:selection')));
}, 1000);
