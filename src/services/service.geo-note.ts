import { FeatureCollection } from '../models/feature-collection/model.feature-collection';
import { EMPTY_FEATURE_COLLECTION } from '../constants';

const _model = FeatureCollection.create(EMPTY_FEATURE_COLLECTION, 'Geo-notes');

export const ServiceGeoNote = {
	getModel() {
		return _model;
	},

	clearSelection() {
		_model.clearSelection();
	},

	deleteSelection() {
		_model.deleteSelection();
	},

	save() {
		_model.setData(EMPTY_FEATURE_COLLECTION);
	}
};
