import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Collapsible } from './cp-collapsible';
import { RadioButtons } from './cp-radio-buttons';
import { ActionSetLanguage } from '../../store/actions/actions';
import {
	State,
	LanguagePack } from '../../types';
import {
	lang,
	language,
	languages } from '../../store/selectors/index.selectors';

interface S {
	lang: LanguagePack;
	language: string;
	languages: LanguagePack[];
}

interface D {
	setLanguage: (language: string) => void;
}

export const _LanguageSelector = React.memo(({ lang, language, languages, setLanguage }: S & D) => (
	<Collapsible title={ lang.settings.language }>
		<RadioButtons
			value={ language }
			options={ languages.map(e => [e.name, e.id]) as any }
			onChange={ setLanguage }
		/>
	</Collapsible>
));

const mapStateToProps = (state: State): S => (
	{
		lang: lang(state),
		language: language(state),
		languages: languages(state)
	}
);

const mapDispatchToProps = (dispatch: Dispatch): D => (
	{
		setLanguage(language: string) {
			dispatch(ActionSetLanguage.create({ language }));
		}
	}
);

export const LanguageSelector = connect(mapStateToProps, mapDispatchToProps)(_LanguageSelector);

