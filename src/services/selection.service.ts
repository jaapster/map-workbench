import { FeatureCollection } from '../types';
import { FeatureCollectionModel } from '../models/feature-collection/feature-collection.model';
import { EMPTY_COLLECTION } from '../constants';

const _model = FeatureCollectionModel.create(EMPTY_COLLECTION, 'Selection');

export const SelectionService = {
	setData(featureCollection: FeatureCollection) {
		_model.setData(featureCollection);
	},

	getModel() {
		return _model;
	},

	deleteSelection() {
		_model.deleteSelection();
	}
};
