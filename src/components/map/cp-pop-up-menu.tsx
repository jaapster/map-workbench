import React from 'react';
import { connect } from 'react-redux';
import { mergeClasses } from '../app/utils/util-merge-classes';
import { ActionSetMapControlMode } from '../../reducers/actions';
import {
	MENU_MODE,
	NAVIGATION_MODE } from '../../constants';
import {
	Point,
	State,
	MapControlMode } from '../../types';
import { Dispatch } from 'redux';
import { mode } from '../../reducers/selectors/index.selectors';

interface Props {
	mode: MapControlMode;
	close: () => void;
}

let mouse: Point = { x: 0, y: 0 };

window.addEventListener('mousemove', ({ clientX, clientY }: any) => {
	mouse = { x: clientX, y: clientY };
});

const getItems = () => [
	[
		'clear selection',
		() => 0
	],
	[
		'delete selection',
		() => 0
	]
];

// const onKeyDown = (e: KeyboardEvent) => {
// 	if (e.key === 'Escape') {
// 		document.removeEventListener('keydown', onKeyDown);
// 		dispatch(ActionSetMapControlMode.create({ mode: NAVIGATION_MODE }));
// 	}
// };

export const _PopUpMenu = React.memo(({ mode, close }: Props) => {
	const { x, y } = mouse;
	const style = { top: y, left: x };

	// document.addEventListener('keydown', onKeyDown);

	return mode === MENU_MODE
		? (
			<div
				onMouseDown={ close }
				className="context-menu list"
				style={ style }
			>
				{
					getItems().map(([label, fn]: any) => {
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
		: null;
});

const mapStateToProps = (state: State) => (
	{
		mode: mode(state)
	}
);

const mapDispatchToProps = (dispatch: Dispatch) => (
	{
		close() {
			dispatch(ActionSetMapControlMode.create({ mode: NAVIGATION_MODE }))
		}
	}
);

export const PopUpMenu = connect(mapStateToProps, mapDispatchToProps)(_PopUpMenu);
