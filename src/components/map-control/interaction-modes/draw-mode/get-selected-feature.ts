import { FeatureCollection } from '../../../../types';
import { oc } from 'ts-optchain';

export const getSelectedFeature = (data: FeatureCollection) => (
	data.features.find(f => oc(f).properties.selected(false))
);
