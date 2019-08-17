import { LanguageData } from 'se';
import {
	Action,
	ActionSetLanguage,
	ActionSetLanguagePacks } from 'lite/store/actions/actions';

const STATE: LanguageData = {
	language: '',
	languagePacks: []
};

export const languageReducer = (state: LanguageData = STATE, action: Action): LanguageData => {
	if (ActionSetLanguagePacks.validate(action)) {
		const { languagePacks } = ActionSetLanguagePacks.data(action);

		return {
			...state,
			language: languagePacks[0].id,
			languagePacks
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
