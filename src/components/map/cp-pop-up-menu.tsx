import React from 'react';
import { Point } from '../../types';
import { MENU_MODE } from '../../constants';
import { MapControl } from '../../map-control/map-control';
import { TrailService } from '../../services/trail.service';
import { GeoNoteService } from '../../services/geo-note.service';

let mouse: Point = { x: 0, y: 0 };

window.addEventListener('mousemove', ({ clientX, clientY }: any) => {
	mouse = { x: clientX, y: clientY };
});

const items: any = [
	[
		'clear selection',
		() => {
			TrailService.clearSelection();
			GeoNoteService.clearSelection();
		}
	],
	[
		'delete selection',
		() => {
			TrailService.deleteSelection();
			GeoNoteService.deleteSelection();
		}
	]
];

const onKeyDown = (e: KeyboardEvent) => {
	if (e.key === 'Escape') {
		document.removeEventListener('keydown', onKeyDown);
		MapControl.instance.activateNavigationMode();
	}
};

export const PopUpMenu = () => {
	document.addEventListener('keydown', onKeyDown);

	return MapControl.instance.getMode() === MENU_MODE
		? (
			<div
				onMouseDown={ MapControl.instance.activateNavigationMode }
				className="context-menu list"
				style={ { top: mouse.y, left: mouse.x } }
			>
				{
					items.map((item: any) => {
						return (
							<div
								key={ item[0] }
								className="list-item"
								onMouseDown={ item[1] }
							>
								{item[0]}
							</div>
						);
					})
				}
			</div>
		)
		: null;
};
