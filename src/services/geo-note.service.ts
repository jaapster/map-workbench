import { data } from '../data/geo-notes.data';
// import { Feature } from '../types';
import { FeatureCollectionModel } from '../models/feature-collection/feature-collection.model';

const _model = FeatureCollectionModel.create(data, 'Geo-notes');

export const GeoNoteService = {
	getModel() {
		return _model;
	},

	clearSelection() {
		_model.clearSelection();
	},

	deleteSelection() {
		_model.deleteSelection();
	}
};
