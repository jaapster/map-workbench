import axios from 'axios';
import { MapControl } from '../map-control/map-control';
import { UniverseService } from './service.universe';
import { LOCATIONS } from '../constants';

export const BootService = {
	boot() {
		MapControl.create({ location: LOCATIONS[0] });

		return Promise
			.all([
				axios.get('/universes'),
				axios.get('/worlds')
			])
			.then((responses) => {
				const [universes, worlds] = responses.map(r => r.data);

				UniverseService.init(universes);

				worlds.forEach(UniverseService.addWorld);
			});
	}
};
