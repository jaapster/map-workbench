import { LanguageData } from '../types';
import {
	Action,
	ActionSetLanguage,
	ActionSetLanguagePacks } from './actions';

const STATE: LanguageData = {
	language: '',
	languagePacks: {}
};

export const languageReducer = (state: LanguageData = STATE, action: Action): LanguageData => {
	if (ActionSetLanguagePacks.validate(action)) {
		const { languagePacks } = ActionSetLanguagePacks.data(action);

		return {
			...state,
			language: Object.keys(languagePacks)[0],
			languagePacks: languagePacks
		};
	}

	if (ActionSetLanguage.validate(action)) {
		const { language } = ActionSetLanguage.data(action);

		return {
			...state,
			language
		};
	}

	return state;
};
