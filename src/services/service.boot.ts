import axios from 'axios';
import { dispatch } from '../reducers/store';
import { WorldData } from '../types';
import { MapControl } from '../map-control/map-control';
import './service.geo-location';
import {
	ActionAddWorld,
	ActionSetUniverses,
	ActionSetReferenceLayers,
	ActionSetCurrentReferenceLayer,
	ActionSetBookmarks,
	ActionSetLanguagePacks
} from '../reducers/actions';

export const BootService = {
	boot() {
		return Promise
			.all([
				axios.get('/universes'),
				axios.get('/worlds'),
				axios.get('/referencelayers'),
				axios.get('/bookmarks'),
				axios.get('/languages')
			])
			.then((responses) => {
				const [universeData, worlds, layers, bookmarks, languagePacks] = responses.map(r => r.data);

				dispatch(ActionSetUniverses.create({ universeData }));
				dispatch(ActionSetBookmarks.create({ bookmarks }));
				dispatch(ActionSetLanguagePacks.create({ languagePacks }));

				worlds.slice().reverse().forEach((worldData: WorldData) => (
					dispatch(ActionAddWorld.create({ worldData }))
				));

				const [layer, style] = layers[1];

				dispatch(ActionSetReferenceLayers.create({ layers }));
				dispatch(ActionSetCurrentReferenceLayer.create({ layer }));

				MapControl.create({
					location: bookmarks[0],
					style
				});
			});
	}
};
