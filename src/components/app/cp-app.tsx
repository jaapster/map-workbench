import React from 'react';
import { Main } from './cp-main';
import { State } from '../../types';
import { connect } from 'react-redux';
import { appPhase, authorized } from '../../reducers/selectors/index.selectors';
import { Dispatch } from 'redux';
import { BootService } from '../../services/service.boot';
import { ActionSetAppPhase } from '../../reducers/actions/actions';
// import { Login } from './cp-login';

interface P1 {
	appPhase: string;
	authorized: boolean;
}

interface P2 {
	setAppPhaseToBooted: () => void;
}

export const _App = React.memo(({ appPhase, authorized, setAppPhaseToBooted }: P1 & P2) => {
	// if (authorized) {
		if (appPhase !== 'booted') {
			BootService
				.boot()
				.then(setAppPhaseToBooted);

			return <div>Booting...</div>;
		}

		return <Main />;
	// }

	// return <Login />;
});

const mapStateToProps = (state: State): P1 => (
	{
		appPhase: appPhase(state),
		authorized: authorized(state)
	}
);

const mapDispatchToProps = (dispatch: Dispatch): P2 => (
	{
		setAppPhaseToBooted() {
			dispatch(ActionSetAppPhase.create({ phase: 'booted' }));
		}
	}
);

export const App = connect(mapStateToProps, mapDispatchToProps)(_App);
