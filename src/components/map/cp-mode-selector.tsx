import React from 'react';
import { mode } from '../../reducers/selectors/index.selectors';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
	ActionClearSelection,
	ActionSetMapControlMode } from '../../reducers/actions';
import {
	Button,
	ButtonGroup } from '../app/cp-button';
import {
	State,
	MapControlMode } from '../../types';
import {
	MENU_MODE,
	UPDATE_MODE,
	NAVIGATION_MODE,
	DRAW_POINT_MODE,
	DRAW_CIRCLE_MODE,
	DRAW_SEGMENTED_MODE,
	DRAW_RECTANGLE_MODE } from '../../constants';

interface Props {
	mode: MapControlMode;
	activateDrawPointMode: () => void;
	activateNavigationMode: () => void;
	activateDrawCircleMode: () => void;
	activateDrawRectangleMode: () => void;
	activateDrawSegmentedMode: () => void;
}

export const _ModeSelector = React.memo((
	{
		mode,
		activateDrawPointMode,
		activateNavigationMode,
		activateDrawCircleMode,
		activateDrawRectangleMode,
		activateDrawSegmentedMode
	}: Props
) => (
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
			onClick={ activateDrawSegmentedMode }
			depressed={ mode === DRAW_SEGMENTED_MODE }
			disabled={ mode !== NAVIGATION_MODE }
		>
			S
		</Button>
		<Button
			onClick={ activateDrawPointMode }
			depressed={ mode === DRAW_POINT_MODE }
			disabled={ mode !== NAVIGATION_MODE }
		>
			P
		</Button>
		<Button
			onClick={ activateDrawCircleMode }
			depressed={ mode === DRAW_CIRCLE_MODE }
			disabled={ mode !== NAVIGATION_MODE }
		>
			C
		</Button>
		<Button
			onClick={ activateDrawRectangleMode }
			depressed={ mode === DRAW_RECTANGLE_MODE }
			disabled={ mode !== NAVIGATION_MODE }
		>
			R
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
		activateDrawSegmentedMode() {
			dispatch(ActionClearSelection.create({}));
			dispatch(ActionSetMapControlMode.create({ mode: DRAW_SEGMENTED_MODE }));
		},
		activateDrawPointMode() {
			dispatch(ActionClearSelection.create({}));
			dispatch(ActionSetMapControlMode.create({ mode: DRAW_POINT_MODE }));
		},
		activateDrawCircleMode() {
			dispatch(ActionClearSelection.create({}));
			dispatch(ActionSetMapControlMode.create({ mode: DRAW_CIRCLE_MODE }));
		},
		activateDrawRectangleMode() {
			dispatch(ActionClearSelection.create({}));
			dispatch(ActionSetMapControlMode.create({ mode: DRAW_RECTANGLE_MODE }));
		},
		activateNavigationMode() {
			dispatch(ActionSetMapControlMode.create({ mode: NAVIGATION_MODE }));
		}
	}
);

export const ModeSelector = connect(mapStateToProps, mapDispatchToProps)(_ModeSelector);
