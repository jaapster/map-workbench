import { uiReducer as ui } from './ui.reducer';
import { systemReducer as system } from './system.reducer';
import { languageReducer as languages } from './language.reducer';
import { combineReducers } from 'redux';
import { settingsReducer as settings } from './settings.reducer';
import { bookmarksReducer as bookmarks } from './bookmarks.reducer';
import { multiverseReducer as multiverse } from './multiverse.reducer';
import { mapControlReducer as mapControl } from './map-control.reducer';
import { geoLocationReducer as geoLocation } from './geo-location.reducer';

export const rootReducer = combineReducers({
	ui,
	system,
	settings,
	languages,
	bookmarks,
	multiverse,
	mapControl,
	geoLocation
});
