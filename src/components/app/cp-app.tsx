import React from 'react';
import { Main } from './cp-main';
import { State } from '../../types';
import { connect } from 'react-redux';
import { appPhase } from '../../reducers/selectors/index.selectors';
import { Dispatch } from 'redux';
import { BootService } from '../../services/service.boot';
import { ActionSetAppPhase } from '../../reducers/actions';

interface Props {
	appPhase: string;
	setAppPhaseToBooted: () => void;
}

export const _App = React.memo(({ appPhase, setAppPhaseToBooted }: Props) => {
		if (appPhase !== 'booted') {
			BootService
				.boot()
				.then(setAppPhaseToBooted);

			return <div>Booting...</div>;
		}

		return <Main />;
});

const mapStateToProps = (state: State) => (
	{
		appPhase: appPhase(state)
	}
);

const mapDispatchToProps = (dispatch: Dispatch) => (
	{
		setAppPhaseToBooted() {
			dispatch(ActionSetAppPhase.create({ phase: 'booted' }));
		}
	}
);

export const App = connect(mapStateToProps, mapDispatchToProps)(_App);
