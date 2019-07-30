import React from 'react';
import './scss/properties.scss';
import { Properties } from './cp-properties';
import { FeatureData } from '../../types';
import { FeatureProperties } from './cp-feature-properties';
import { getSelectedFeatures } from '../../reducers/selectors/index.selectors';
import { connect } from 'react-redux';

interface Props {
	features: FeatureData<any>[];
}

export const _Selection = ({ features }: Props) => (
	<Properties>
		<h2>Selection properties</h2>
		<FeatureProperties features={ features } />
	</Properties>
);

const mapStateToProps = () => (
	{
		features: getSelectedFeatures('trails')
	}
);

export const Selection = connect(mapStateToProps)(_Selection);
