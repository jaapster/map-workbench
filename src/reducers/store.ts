import { State } from '../types';
import { Action } from './actions/actions';
import { createStore } from 'redux';
import { rootReducer } from './root.reducer';
import { BatchAction, enableBatching } from 'redux-batched-actions';

export const store = createStore(
	enableBatching(rootReducer),
	{}
);

export const dispatch = (action: Action | BatchAction) => {
	store.dispatch(action);
};

export const getState = (): State => store.getState() as State;

// export const subscribe = (fn: any) => store.subscribe(fn);

