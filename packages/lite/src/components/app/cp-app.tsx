import React from 'react';
import { Main } from './cp-main';
import { State } from 'se';
import { Login } from './cp-login';
import { connect } from 'react-redux';
import { Spinner } from 'lite/components/app/cp-spinner';
import { DocumentTitle } from 'lite/components/app/cp-document-title';
import {
	appPhase,
	authorized } from 'lite/store/selectors/index.selectors';

interface Props {
	appPhase: string;
	authorized: boolean;
}

export const _App = React.memo(({ appPhase, authorized }: Props) => (
	<>
		<DocumentTitle title={ 'Lite Light' } />
		{
			appPhase === 'loading'
				? <Spinner />
				: authorized
					? <Main />
					: <Login />
		}
	</>
));

const mapStateToProps = (state: State): Props => (
	{
		appPhase: appPhase(state),
		authorized: authorized(state)
	}
);

export const App = connect(mapStateToProps)(_App);
