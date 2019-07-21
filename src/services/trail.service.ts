import { data } from '../data/trails.data';
import { FeatureCollectionModel } from '../models/feature-collection/feature-collection.model';

const _model = FeatureCollectionModel.create(data, 'Trails');

export const TrailService = {
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
