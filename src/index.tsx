import 'array-flat-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.scss';
import './style/fonts/icomoon/style.css';
import { App } from './components/app/cp-app';
import { store } from './store/store';
import { Provider } from 'react-redux';
import { ActionLoadProject } from './store/actions/actions';

// @ts-ignore
store.dispatch(ActionLoadProject.create());

ReactDOM.render((
	<Provider store={ store }>
		<App />
	</Provider>
), document.getElementById('root'));
