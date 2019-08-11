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
	ActionSetCurrentReferenceLayer } from '../reducers/actions/actions';
import { OverviewControl } from '../map-control/overview-control';
import { batchActions } from 'redux-batched-actions';

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

				const [layer, style] = layers[1];

				dispatch(batchActions([
					ActionSetUniverses.create({ universeData }),
					ActionSetBookmarks.create({ bookmarks }),
					ActionSetLanguagePacks.create({ languagePacks }),
					ActionSetReferenceLayers.create({ layers }),
					ActionSetCurrentReferenceLayer.create({ layer })
				].concat(worlds.map((worldData: any) => ActionAddWorld.create({
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
				})))));

				MapControl.create({
					location: bookmarks[0],
					style
				});

				OverviewControl.create({
					location: bookmarks[0],
					style
				});
			});
	}
};
