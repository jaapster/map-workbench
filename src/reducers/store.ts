import { createStore } from 'redux';
import { rootReducer } from './root.reducer';

export const store = createStore(
	rootReducer,
	{
		multiverse: {}
	}
);

export const dispatch = (action: any) => store.dispatch(action);

export const getState = () => store.getState();

export const subscribe = (fn: any) => store.subscribe(fn);

