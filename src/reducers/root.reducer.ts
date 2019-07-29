import { combineReducers } from 'redux';
import { multiverseReducer as multiverse } from './multiverse.reducer';


export const rootReducer = combineReducers({
	multiverse
});
