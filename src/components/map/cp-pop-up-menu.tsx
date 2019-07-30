import React from 'react';
import { MapControlData, MapControlMode, Point } from '../../types';
import { MENU_MODE } from '../../constants';
import { MapControl } from '../../map-control/map-control';
import { mergeClasses } from '../app/utils/util-merge-classes';
import { connect } from 'react-redux';

interface Props {
	mode: MapControlMode;
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

const onKeyDown = (e: KeyboardEvent) => {
	if (e.key === 'Escape') {
		document.removeEventListener('keydown', onKeyDown);
		MapControl.activateNavigationMode();
	}
};

export const _PopUpMenu = ({ mode }: Props) => {
	const { x, y } = mouse;
	const style = { top: y, left: x };

	document.addEventListener('keydown', onKeyDown);

	return mode === MENU_MODE
		? (
			<div
				onMouseDown={ MapControl.activateNavigationMode }
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
};

const mapStateToProps = (state: { mapControl: MapControlData }) => (
	{
		mode: state.mapControl.mode
	}
);

export const PopUpMenu = connect(mapStateToProps)(_PopUpMenu);
