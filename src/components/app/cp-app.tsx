import React from 'react';
import { Main } from './cp-main';
import { State } from '../../types';
import { Login } from './cp-login';
import { connect } from 'react-redux';
import { appPhase, authorized } from '../../store/selectors/index.selectors';

interface Props {
	appPhase: string;
	authorized: boolean;
}

export const _App = React.memo(({ appPhase, authorized }: Props) => {
	if (authorized) {
		if (appPhase !== 'booted') {
			return <div>Loading project...</div>;
		}

		return <Main />;
	}

	return <Login />;
});

const mapStateToProps = (state: State): Props => (
	{
		appPhase: appPhase(state),
		authorized: authorized(state)
	}
);

export const App = connect(mapStateToProps)(_App);
