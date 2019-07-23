import bind from 'autobind-decorator';
import React from 'react';
import { Point } from '../../types';
import { MENU_MODE } from '../../constants';
import { MapControl } from '../../map-control/map-control';
import { TrailService } from '../../services/trail.service';
import { GeoNoteService } from '../../services/geo-note.service';

interface Props {}

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

@bind
export class PopUpMenu extends React.Component<Props> {
	static onMouseDown() {
		MapControl.instance.activateNavigationMode();
	}

	componentDidMount() {
		MapControl.instance.on('modeChange', this._onModeChange);
	}

	private _onModeChange() {
		this.forceUpdate();
	}

	render() {
		const { x, y } = mouse;
		const style = { top: y, left: x };


		const onKeyDown = (e: any) => {
			if (e.key === 'Escape') {
				document.removeEventListener('keydown', onKeyDown);
				PopUpMenu.onMouseDown();
			}
		};

		document.addEventListener('keydown', onKeyDown);

		return MapControl.instance.getMode() === MENU_MODE
			? (
				<div
					onMouseDown={ PopUpMenu.onMouseDown }
					className="context-menu list"
					style={ style }
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
	}
}
