import React from 'react';
import { Point } from '../../types';
import { TrailService } from '../../services/trail.service';
import { GeoNoteService } from '../../services/geo-note.service';

interface Props {
	data: {
		location: Point;
	};
	close: any;
}

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

export const PopUpMenu = (props: Props) => {
	const { data: { location: { x, y } }, close } = props;

	const onMouseDown = (e: any) => {
		close();
		document.removeEventListener('mousedown', onMouseDown);
	};

	const onKeyDown = (e: any) => {
		if (e.key === 'Escape') {
			close();
			document.removeEventListener('keydown', onKeyDown);
		}
	};

	document.addEventListener('keydown', onKeyDown);
	document.addEventListener('mousedown', onMouseDown);

	return (
		<div className="context-menu list" style={ { top: y, left: x } } >
			{
				items.map((item: any) => {
					return (
						<div
							key={ item[0] }
							className="list-item"
							onMouseDown={ item[1] }
						>
							{ item[0] }
						</div>
					);
				})
			}
		</div>
	);
};
