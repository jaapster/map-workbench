import axios from 'axios';
import { dispatch } from '../reducers/store';
import { WorldData } from '../types';
import { LOCATIONS } from '../constants';
import { MapControl } from '../map-control/map-control';
import './service.geo-location';
import {
	ActionAddWorld,
	ActionSetUniverses,
	ActionSetReferenceLayers } from '../reducers/actions';

export const BootService = {
	boot() {
		MapControl.create({ location: LOCATIONS[0] });

		return Promise
			.all([
				axios.get('/universes'),
				axios.get('/worlds'),
				axios.get('/referencelayers')
			])
			.then((responses) => {
				const [universes, worlds, layers] = responses.map(r => r.data);

				dispatch(ActionSetUniverses.create({ universeData: universes }));

				worlds.slice().reverse().forEach((worldData: WorldData) => (
					dispatch(ActionAddWorld.create({ worldData }))
				));

				dispatch(ActionSetReferenceLayers.create({ layers }));
			});
	}
};
