import thunk from 'redux-thunk';
import { State } from 'se';
import { Action } from './actions/actions';
import { rootReducer } from './reducers/root.reducer';
import {
	createStore,
	applyMiddleware } from 'redux';
import {
	BatchAction,
	enableBatching } from 'redux-batched-actions';

export const store = createStore(
	enableBatching(rootReducer),
	applyMiddleware(thunk)
);

export const dispatch = (action: Action | BatchAction | any) => {
	store.dispatch(action);
};

export const getState = (): State => store.getState() as State;

// export const subscribe = (fn: any) => store.subscribe(fn);

