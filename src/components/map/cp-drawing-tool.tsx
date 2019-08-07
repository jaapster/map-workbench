import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
	mode,
	currentSelectionFeatures } from '../../reducers/selectors/index.selectors';
import {
	ActionClearSelection,
	ActionDeleteSelection,
	ActionSetMapControlMode } from '../../reducers/actions';
import {
	Button,
	ButtonGroup } from '../app/cp-button';
import {
	State,
	MapControlMode } from '../../types';
import {
	DRAW_POINT_MODE,
	DRAW_CIRCLE_MODE,
	DRAW_SEGMENTED_MODE,
	DRAW_RECTANGLE_MODE } from '../../constants';

interface Props {
	mode: MapControlMode;
	isDrawing: boolean;
	hasSelection: boolean;
	clearSelection: () => void;
	deleteSelection: () => void;
	activateDrawPointMode: () => void;
	activateDrawCircleMode: () => void;
	activateDrawRectangleMode: () => void;
	activateDrawSegmentedMode: () => void;
}

export const _DrawingTools = React.memo((
	{
		mode,
		isDrawing,
		hasSelection,
		clearSelection,
		deleteSelection,
		activateDrawPointMode,
		activateDrawCircleMode,
		activateDrawRectangleMode,
		activateDrawSegmentedMode
	}: Props
) => (
	<div>
		<ButtonGroup>
			<Button
				onClick={ activateDrawSegmentedMode }
				depressed={ mode === DRAW_SEGMENTED_MODE }
				disabled={ isDrawing }
			>
				<i className="icon-vector-polyline" />
			</Button>
			<Button
				onClick={ activateDrawPointMode }
				depressed={ mode === DRAW_POINT_MODE }
				disabled={ isDrawing }
			>
				<i className="icon-map-marker-outline" />
			</Button>
			<Button
				onClick={ activateDrawCircleMode }
				depressed={ mode === DRAW_CIRCLE_MODE }
				disabled={ isDrawing }
			>
				<i className="icon-vector-circle-variant" />
			</Button>
			<Button
				onClick={ activateDrawRectangleMode }
				depressed={ mode === DRAW_RECTANGLE_MODE }
				disabled={ isDrawing }
			>
				<i className="icon-vector-rectangle" />
			</Button>
		</ButtonGroup>
		{
			hasSelection && !isDrawing
				? (
					<>
						<ButtonGroup>
							<Button
								onClick={ clearSelection }
								className="clear"
							>
								<i className="icon-cancel" />
							</Button>
						</ButtonGroup>
						<ButtonGroup>
							<Button
								onClick={ deleteSelection }
								className="delete"
							>
								<i className="icon-trashcan" />
							</Button>
						</ButtonGroup>
					</>
				)
				: null
		}
	</div>
));

const mapStateToProps = (state: State) => (
	{
		mode: mode(state),
		isDrawing: mode(state).indexOf('draw') > -1,
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
		},
		clearSelection() {
			dispatch(ActionClearSelection.create({}));
		}
	}
);

export const DrawingTools = connect(mapStateToProps, mapDispatchToProps)(_DrawingTools);
