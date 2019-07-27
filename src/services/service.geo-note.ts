// import { data } from '../data/geo-notes.data';
import { FeatureCollection } from '../models/feature-collection/model.feature-collection';
import { EMPTY_FEATURE_COLLECTION } from '../constants';

// const _model = FeatureCollection.create(data, 'Geo-notes');
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
	}
};
