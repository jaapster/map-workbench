import { combineReducers } from 'redux';
import { uiReducer as ui } from './ui.reducer';
import { userReducer as user } from './user.reducer';
import { systemReducer as system } from './system.reducer';
import { serverReducer as server } from './server.reducer';
import { projectReducer as project } from './project.reducer';
import { languageReducer as languages } from './language.reducer';
import { settingsReducer as settings } from './settings.reducer';
import { bookmarksReducer as bookmarks } from './bookmarks.reducer';
import { multiverseReducer as multiverse } from './multiverse.reducer';
import { mapControlReducer as mapControl } from './map-control.reducer';
import { geoLocationReducer as geoLocation } from './geo-location.reducer';
import { applicationReducer as application } from './application.reducer';
import { serverSettingsReducer as serverSettings } from './server-settings.reducer';

export const rootReducer = combineReducers({
	ui,
	user,
	system,
	server,
	project,
	settings,
	languages,
	bookmarks,
	multiverse,
	mapControl,
	application,
	geoLocation,
	serverSettings
});
