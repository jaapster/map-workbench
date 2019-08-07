import React from 'react';
import './scss/properties.scss';
import { lang } from '../../reducers/selectors/index.selectors';
import { LanguagePack, State } from '../../types';
import { Properties } from './cp-properties';
import { UnitSystemSelector } from './cp-unit-system-selector';
import { LanguageSelector } from './cp-language-selector';
import { ScaleSelector } from './cp-scale-selector';
import { connect } from 'react-redux';

interface Props {
	lang: LanguagePack;
}

export const _Settings = React.memo(({ lang }: Props) => (
	<Properties>
		<h2>{ lang.settings.title }</h2>
		<UnitSystemSelector />
		<LanguageSelector />
		<ScaleSelector />
	</Properties>
));

const mapStateToProps = (state: State) => (
	{
		lang: lang(state)
	}
);

export const Settings = connect(mapStateToProps)(_Settings);
