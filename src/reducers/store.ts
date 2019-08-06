import { Action } from './actions';
import { createStore } from 'redux';
import { rootReducer } from './root.reducer';
import { State } from '../types';

export const store = createStore(
	rootReducer,
	{}
);

export const dispatch = (action: Action) => {
	store.dispatch(action);
};

export const getState = (): State => store.getState() as State;

// export const subscribe = (fn: any) => store.subscribe(fn);

