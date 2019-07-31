import React from 'react';
import { mode } from '../../reducers/selectors/index.selectors';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { mergeClasses } from '../app/utils/util-merge-classes';
import {
	ActionClearSelection,
	ActionDeleteSelection,
	ActionSetMapControlMode } from '../../reducers/actions';
import {
	MENU_MODE,
	NAVIGATION_MODE } from '../../constants';
import {
	State,
	MapControlMode } from '../../types';

interface P1 {
	mode: MapControlMode;
}

interface P2 {
	close: () => void;
	clearSelection: () => void;
	deleteSelection: () => void;
}

let mouse: { left: number, top: number } = { left: 0, top: 0 };

window.addEventListener('mousemove', ({ clientX, clientY }: any) => {
	mouse = { left: clientX, top: clientY };
});

export const _PopUpMenu = React.memo(({ mode, close, clearSelection, deleteSelection }: P1 & P2) => (
	mode === MENU_MODE
		? (
			<div
				onMouseDown={ close }
				className="context-menu list"
				style={ mouse }
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
		mode: mode(state)
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
