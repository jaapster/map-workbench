import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RadioButtons } from './cp-radio-buttons';
import { ActionSetLanguage } from '../../reducers/actions';
import {
	State,
	LanguagePack } from '../../types';
import {
	lang,
	language,
	languages } from '../../reducers/selectors/index.selectors';

interface Props {
	lang: LanguagePack;
	language: string;
	languages: LanguagePack[];
	setLanguage: (language: string) => void;
}

export const _LanguageSelector = React.memo(({ lang, language, languages, setLanguage }: Props) => (
	<RadioButtons
		label={ lang.settings.language }
		value={ language }
		options={ languages.map(e => [e.name, e.id]) as any }
		onChange={ setLanguage }
	/>
));

const mapStateToProps = (state: State) => (
	{
		lang: lang(state),
		language: language(state),
		languages: languages(state)
	}
);

const mapDispatchToProps = (dispatch: Dispatch) => (
	{
		setLanguage(language: string) {
			dispatch(ActionSetLanguage.create({ language }));
		}
	}
);

export const LanguageSelector = connect(mapStateToProps, mapDispatchToProps)(_LanguageSelector);

