import { combineReducers } from 'redux';
import { multiverseReducer as multiverse } from './multiverse.reducer';
import { mapControlReducer as mapControl } from './map-control.reducer';
import { appPhaseReducer as appPhase } from './phase.reducer';

export const rootReducer = combineReducers({
	multiverse,
	mapControl,
	appPhase
});
