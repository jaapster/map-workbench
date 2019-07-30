import { combineReducers } from 'redux';
import { multiverseReducer as multiverse } from './multiverse.reducer';
import { mapControlReducer as mapControl } from './map-control.reducer';

export const rootReducer = combineReducers({
	multiverse,
	mapControl
});
