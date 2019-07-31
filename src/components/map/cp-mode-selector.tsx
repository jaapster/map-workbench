import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { ActionSetMapControlMode } from '../../reducers/actions';
import {
	Button,
	ButtonGroup } from '../app/cp-button';
import {
	State,
	MapControlMode } from '../../types';
import {
	DRAW_MODE,
	MENU_MODE,
	UPDATE_MODE,
	NAVIGATION_MODE } from '../../constants';
import { mode } from '../../reducers/selectors/index.selectors';

interface Props {
	mode: MapControlMode;
	activateDrawMode: () => void;
	activateNavigationMode: () => void;
}

export const _ModeSelector = React.memo(({ mode, activateDrawMode, activateNavigationMode }: Props) => (
	<ButtonGroup>
		<Button
			onClick={ activateNavigationMode }
			depressed={ mode === NAVIGATION_MODE }
		>
			Navigate
		</Button>
		<Button
			disabled
			depressed={ mode === UPDATE_MODE }
		>
			Update
		</Button>
		<Button
			disabled
			depressed={ mode === MENU_MODE }
		>
			Menu
		</Button>
		<Button
			onClick={ activateDrawMode }
			depressed={ mode === DRAW_MODE }
		>
			Draw
		</Button>
	</ButtonGroup>
));

const mapStateToProps = (state: State) => (
	{
		mode: mode(state)
	}
);

const mapDispatchToProps = (dispatch: Dispatch) => (
	{
		activateDrawMode() {
			dispatch(ActionSetMapControlMode.create({ mode: DRAW_MODE }));
		},
		activateNavigationMode() {
			dispatch(ActionSetMapControlMode.create({ mode: NAVIGATION_MODE }));
		}
	}
);

export const ModeSelector = connect(mapStateToProps, mapDispatchToProps)(_ModeSelector);
