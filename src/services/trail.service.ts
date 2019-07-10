import { data } from '../data/trails.data';
import { Feature } from '../types';
import { FeatureCollectionModel } from '../models/feature-collection/feature-collection.model';

const _model = FeatureCollectionModel.create(data);

export const TrailService = {
	getModel() {
		return _model;
	},

	addFeature(f: Feature<any>) {
		_model.data = {
			..._model.data,
			features: _model.data.features.concat(f)
		};
	}
};
