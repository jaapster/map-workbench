import { FeatureCollectionModel } from '../models/feature-collection/feature-collection.model';
import { EMPTY } from '../constants';

const _model = FeatureCollectionModel.create(EMPTY);

export const SelectionService = {
	getModel() {
		return _model;
	}
};
