import 'array-flat-polyfill';
import './style/index.scss';
import './style/fonts/icomoon/style.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/app/cp-app';
import { store } from './store/store';
import { Provider } from 'react-redux';
import { ActionLoadApplicationInfo } from './store/actions/actions';

// @ts-ignore
store.dispatch(ActionLoadApplicationInfo.create());

ReactDOM.render((
	<Provider store={ store }>
		<App />
	</Provider>
), document.getElementById('root'));
