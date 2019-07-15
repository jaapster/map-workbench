import { TrailService } from './trail.service';
import { GeoNoteService } from './geo-note.service';
import { FeatureCollectionModel } from '../models/feature-collection/feature-collection.model';

export const SelectionService = {
	select(model: FeatureCollectionModel, index: number[], add: boolean) {
		if (!add) {
			TrailService.getModel().cleanUp();
			GeoNoteService.getModel().cleanUp();
		}

		model.select(index, add);
	}
};
