import React from 'react';
import './scss/properties.scss';
import { connect } from 'react-redux';
import { Properties } from './cp-properties';
import { FeatureProperties } from './cp-feature-properties';
import {
	crs,
	lang,
	currentSelectionFeatures } from '../../reducers/selectors/index.selectors';
import {
	EPSG,
	State,
	Feature,
	LanguagePack } from '../../types';

interface Props {
	CRS: EPSG;
	lang: LanguagePack;
	features: Feature<any>[];
}

export const _Selection = React.memo(({ CRS, lang, features }: Props) => (
	<Properties>
		<h2>{ lang.selectionProperties.title }</h2>
		<FeatureProperties features={ features } CRS={ CRS } />
	</Properties>
));

const mapStateToProps = (state: State) => (
	{
		CRS: crs(state),
		lang: lang(state),
		features: currentSelectionFeatures(state)
	}
);

export const Selection = connect(mapStateToProps)(_Selection);
