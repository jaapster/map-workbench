import React from 'react';
import { lang } from 'lite/store/selectors/index.selectors';
import { connect } from 'react-redux';
import { Properties } from '../cp-properties';
import { ReferenceLayer } from './cp-reference-layer';
// import { WorldSelector } from './cp-world-selector';
import { MapLayers } from 'lite/components/app/side-panels/cp-map-layers';
import {
	State,
	LanguagePack } from 'se';
import { Maps } from 'lite/components/app/side-panels/cp-maps';

interface Props {
	lang: LanguagePack;
}

export const _MapsAndLayers = React.memo(({ lang }: Props) => (
	<Properties>
		<h2>{ lang.map.title }</h2>
		<div className="body">
			<Maps />
			<MapLayers />
			<ReferenceLayer />
		</div>
	</Properties>

));

const mapStateToProps = (state: State) => (
	{
		lang: lang(state)
	}
);

export const MapsAndLayers = connect(mapStateToProps)(_MapsAndLayers);

