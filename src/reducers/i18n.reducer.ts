import { I18nData } from '../types';
import {
	Action,
	ActionSetLanguage, ActionSetLanguagePacks
} from './actions';

const STATE: I18nData = {
	language: '',
	languages: {},
	languageIds: [],
	languageOptions: []
};

export const i18nReducer = (state: I18nData = STATE, action: Action): I18nData => {
	if (ActionSetLanguagePacks.validate(action)) {
		const { languagePacks } = ActionSetLanguagePacks.data(action);

		return {
			...state,
			languages: languagePacks,
			language: Object.keys(languagePacks)[0],
			languageIds: Object.keys(languagePacks),
			languageOptions: Object.keys(languagePacks).map((key: any) => {
				return [languagePacks[key].name, key];
			})
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
