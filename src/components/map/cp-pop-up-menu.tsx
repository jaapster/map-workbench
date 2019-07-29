import bind from 'autobind-decorator';
import React from 'react';
import { Point } from '../../types';
import { MENU_MODE } from '../../constants';
import { MapControl } from '../../map-control/map-control';
import { SelectionService } from '../../services/service.selection';
import { mergeClasses } from '../app/utils/util-merge-classes';
import { MessageService } from '../../services/service.message';

interface Props {}

let mouse: Point = { x: 0, y: 0 };

window.addEventListener('mousemove', ({ clientX, clientY }: any) => {
	mouse = { x: clientX, y: clientY };
});

const getItems = () => [
	[
		'clear selection',
		SelectionService.clearSelection
	],
	[
		'delete selection',
		SelectionService.deleteSelection
	]
];

const onKeyDown = (e: KeyboardEvent) => {
	if (e.key === 'Escape') {
		document.removeEventListener('keydown', onKeyDown);
		MapControl.activateNavigationMode();
	}
};

@bind
export class PopUpMenu extends React.Component<Props> {
	componentDidMount() {
		MessageService.on('update:mode', this._onModeChange);
	}

	componentWillUnmount() {
		MessageService.on('update:mode', this._onModeChange);
	}

	private _onModeChange() {
		this.forceUpdate();
	}

	render() {
		const { x, y } = mouse;
		const style = { top: y, left: x };

		document.addEventListener('keydown', onKeyDown);

		return MapControl.getMode() === MENU_MODE
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
	}
}
