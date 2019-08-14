import { POINT } from '../constants/constants';
import {
	Co,
	SelectionVector,
	FeatureCollection } from '../types';

export const getSelectedVertices = (
	{ features }: FeatureCollection,
	selection: SelectionVector[]
): Co[] => (
	selection.reduce((m, [_i, _j, _k, _l]) => (
		_i == null
			? m
			: _j == null
			? features[_i].properties.type === POINT
				? m.concat([features[_i].geometry.coordinates])
				: m
			: m.concat([
				_k == null
					? features[_i].geometry.coordinates[_j]
					: _l == null
					? features[_i].geometry.coordinates[_j][_k]
					: features[_i].geometry.coordinates[_j][_k][_l]
			])
	), [] as Co[])
);
