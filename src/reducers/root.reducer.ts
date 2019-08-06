import { uiReducer as ui } from './ui.reducer';
import { combineReducers } from 'redux';
import { settingsReducer as settings } from './settings.reducer';
import { appPhaseReducer as appPhase } from './phase.reducer';
import { multiverseReducer as multiverse } from './multiverse.reducer';
import { mapControlReducer as mapControl } from './map-control.reducer';
import { bookmarksReducer as bookmarks } from './bookmarks.reducer';
import { geoLocationReducer as geoLocation } from './geo-location.reducer';

export const rootReducer = combineReducers({
	ui,
	settings,
	appPhase,
	bookmarks,
	multiverse,
	mapControl,
	geoLocation
});
