import React from 'react';
import './scss/properties.scss';
import { connect } from 'react-redux';
import { Properties } from './cp-properties';
import { FeatureProperties } from './cp-feature-properties';
import {
	currentCRS,
	lang,
	currentSelectionFeatures } from 'lite/store/selectors/index.selectors';
import {
	EPSG,
	State,
	Feature,
	LanguagePack, Geometry } from 'se';

interface Props {
	CRS: EPSG;
	lang: LanguagePack;
	features: Feature<Geometry>[];
}

export const _Selection = React.memo(({ CRS, lang, features }: Props) => (
	<Properties>
		<h2>{ lang.selectionProperties.title }</h2>
		<FeatureProperties features={ features } CRS={ CRS } />
	</Properties>
));

const mapStateToProps = (state: State) => (
	{
		CRS: currentCRS(state),
		lang: lang(state),
		features: currentSelectionFeatures(state)
	}
);

export const Selection = connect(mapStateToProps)(_Selection);