import { combineReducers } from 'redux';
import { multiverseReducer as multiverse } from './reducer.multiverse';


export const rootReducer = combineReducers({
	multiverse
});
