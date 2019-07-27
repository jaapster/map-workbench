import axios from 'axios';
import { UniverseService } from './service.universe';

export const BootService = {
	boot() {
		return Promise
			.all([
				axios.get('/universes'),
				axios.get('/worlds')
			])
			.then((responses) => {
				const [universes, worlds] = responses.map(r => r.data);

				UniverseService.init(universes);
				UniverseService.addWorld(worlds[0]);
			});
	}
};
