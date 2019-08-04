import React from 'react';
import './scss/properties.scss';
import { connect } from 'react-redux';
import { Properties } from './cp-properties';
import { FeatureProperties } from './cp-feature-properties';
import {
	crs,
	currentSelectionFeatures } from '../../reducers/selectors/index.selectors';
import {
	EPSG,
	State,
	Feature } from '../../types';

interface Props {
	features: Feature<any>[];
	CRS: EPSG;
}

export const _Selection = ({ features, CRS }: Props) => (
	<Properties>
		<h2>Selection properties</h2>
		<FeatureProperties features={ features } CRS={ CRS } />
	</Properties>
);

const mapStateToProps = (state: State) => (
	{
		features: currentSelectionFeatures(state),
		CRS: crs(state)
	}
);

export const Selection = connect(mapStateToProps)(_Selection);
