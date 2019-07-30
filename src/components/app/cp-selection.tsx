import React from 'react';
import './scss/properties.scss';
import { Properties } from './cp-properties';
import { EPSG, FeatureData, State } from '../../types';
import { FeatureProperties } from './cp-feature-properties';
import { getSelectedFeatures } from '../../reducers/selectors/index.selectors';
import { connect } from 'react-redux';

interface Props {
	features: FeatureData<any>[];
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
		features: getSelectedFeatures('trails'),
		CRS: state.mapControl.CRS
	}
);

export const Selection = connect(mapStateToProps)(_Selection);
