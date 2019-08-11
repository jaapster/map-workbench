import React from 'react';
import { mode, mouse } from '../../reducers/selectors/index.selectors';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { mergeClasses } from '../app/utils/util-merge-classes';
import {
	ActionClearSelection,
	ActionDeleteSelection,
	ActionSetMapControlMode } from '../../reducers/actions/actions';
import {
	MENU_MODE,
	NAVIGATION_MODE } from '../../constants';
import {
	State,
	MapControlMode, Co
} from '../../types';
import { MapControl } from '../../map-control/map-control';

interface P1 {
	mode: MapControlMode;
	mouse: Co;
}

interface P2 {
	close: () => void;
	clearSelection: () => void;
	deleteSelection: () => void;
}

const foo = (co: Co) => {
	const { x: left, y: top } = MapControl.project(co);

	return { top, left };
};

export const _PopUpMenu = React.memo(({ mode, mouse, close, clearSelection, deleteSelection }: P1 & P2) => (
	mode === MENU_MODE
		? (
			<div
				onMouseDown={ close }
				className="context-menu list"
				style={ foo(mouse) }
			>
				{
					[
						['clear selection', clearSelection],
						['delete selection', deleteSelection]
					].map(([label, fn]: any) => {
						const className = mergeClasses(
							'list-item',
							{
								'disabled': false
							}
						);

						return (
							<div
								key={ label }
								className={ className }
								onMouseDown={ fn }
							>
								{ label }
							</div>
						);
					})
				}
			</div>
		)
		: null
));

const mapStateToProps = (state: State): P1 => (
	{
		mode: mode(state),
		mouse: mouse(state)
	}
);

const mapDispatchToProps = (dispatch: Dispatch): P2 => (
	{
		close() {
			dispatch(ActionSetMapControlMode.create({ mode: NAVIGATION_MODE }));
		},
		clearSelection() {
			dispatch(ActionClearSelection.create({}));
		},
		deleteSelection() {
			dispatch(ActionDeleteSelection.create({}));
		}
	}
);

export const PopUpMenu = connect(mapStateToProps, mapDispatchToProps)(_PopUpMenu);
