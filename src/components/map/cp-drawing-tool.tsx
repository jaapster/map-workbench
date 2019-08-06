import React from 'react';
import {
	currentSelectionFeatures,
	mode
} from '../../reducers/selectors/index.selectors';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
	ActionClearSelection, ActionDeleteSelection,
	ActionSetMapControlMode
} from '../../reducers/actions';
import {
	Button,
	ButtonGroup } from '../app/cp-button';
import {
	State,
	MapControlMode } from '../../types';
import {
	NAVIGATION_MODE,
	DRAW_POINT_MODE,
	DRAW_CIRCLE_MODE,
	DRAW_SEGMENTED_MODE,
	DRAW_RECTANGLE_MODE } from '../../constants';

interface Props {
	mode: MapControlMode;
	hasSelection: boolean;
	deleteSelection: () => void;
	activateDrawPointMode: () => void;
	activateDrawCircleMode: () => void;
	activateDrawRectangleMode: () => void;
	activateDrawSegmentedMode: () => void;
}

export const _DrawingTools = React.memo((
	{
		mode,
		hasSelection,
		deleteSelection,
		activateDrawPointMode,
		activateDrawCircleMode,
		activateDrawRectangleMode,
		activateDrawSegmentedMode
	}: Props
) => (
	<>
		<ButtonGroup>
			<Button
				onClick={ activateDrawSegmentedMode }
				depressed={ mode === DRAW_SEGMENTED_MODE }
				disabled={ mode.indexOf('draw') > -1 }
			>
				S
			</Button>
			<Button
				onClick={ activateDrawPointMode }
				depressed={ mode === DRAW_POINT_MODE }
				disabled={ mode.indexOf('draw') > -1 }
			>
				P
			</Button>
			<Button
				onClick={ activateDrawCircleMode }
				depressed={ mode === DRAW_CIRCLE_MODE }
				disabled={ mode.indexOf('draw') > -1 }
			>
				C
			</Button>
			<Button
				onClick={ activateDrawRectangleMode }
				depressed={ mode === DRAW_RECTANGLE_MODE }
				disabled={ mode.indexOf('draw') > -1 }
			>
				R
			</Button>
		</ButtonGroup>
		{
			hasSelection && mode.indexOf('draw') === -1
				? (
					<ButtonGroup>
						<Button
							onClick={ deleteSelection }
							className="delete"
						>
							Delete
						</Button>
					</ButtonGroup>
				)
				: null
		}
	</>
));

const mapStateToProps = (state: State) => (
	{
		mode: mode(state),
		hasSelection: currentSelectionFeatures(state).length > 0
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
		deleteSelection() {
			dispatch(ActionDeleteSelection.create({}));
		}
	}
);

export const DrawingTools = connect(mapStateToProps, mapDispatchToProps)(_DrawingTools);
