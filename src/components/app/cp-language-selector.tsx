import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { State } from '../../types';
import { RadioButtons } from './cp-radio-buttons';

interface Props {
	language: string;
	languages: [string, string][];
	setLanguage: (language: string) => void;
}

export const _LanguageSelector = React.memo(({ language, languages, setLanguage }: Props) => (
	<RadioButtons
		label="Language"
		options={ languages }
		value={ language }
		onChange={ setLanguage }
	/>
));

const mapStateToProps = (state: State) => (
	{
		language: 'en',
		languages: [['en', 'en'], ['nl', 'nl']] as [string, string][]
	}
);

const mapDispatchToProps = (dispatch: Dispatch) => (
	{
		setLanguage(language: string) {
			console.log('set language:', language); // remove me
		}
	}
);

export const LanguageSelector = connect(mapStateToProps, mapDispatchToProps)(_LanguageSelector);

