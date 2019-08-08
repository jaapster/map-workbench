import axios from 'axios';
import { dispatch } from '../reducers/store';
import { MapControl } from '../map-control/map-control';
import './service.geo-location';
import {
	ActionAddWorld,
	ActionSetUniverses,
	ActionSetBookmarks,
	ActionSetLanguagePacks,
	ActionSetReferenceLayers,
	ActionSetCurrentReferenceLayer } from '../reducers/actions';

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

				worlds.slice().reverse().forEach((worldData: any) => (
					dispatch(ActionAddWorld.create({
						worldData: {
							...worldData,
							collections: worldData.collections.map((collection: any) => (
								{
									featureCollection: collection,
									selection: [],
									name: collection.properties.name
								}
							))
						}
					}))
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
