import bind from 'autobind-decorator';
import React from 'react';
import { MapControl } from '../../map-control/map-control';
import { Button, ButtonGroup } from '../app/cp-button';
import {
	DRAW_MODE,
	MENU_MODE,
	UPDATE_MODE,
	NAVIGATION_MODE } from '../../constants';
import { MessageService } from '../../services/service.message';

interface Props {}

@bind
export class ModeSelector extends React.Component<Props> {
	componentDidMount() {
		MessageService.on('update:mode', this._update);
	}

	componentWillUnmount() {
		MessageService.off('update:mode', this._update);
	}

	_update() {
		this.forceUpdate();
	}

	render() {
		const mode = MapControl.getMode();

		return (
			<ButtonGroup>
				<Button
					onClick={ MapControl.activateNavigationMode }
					depressed={ mode === NAVIGATION_MODE }
				>
					Navigate
				</Button>
				<Button
					disabled
					depressed={ mode === UPDATE_MODE }
				>
					Update
				</Button>
				<Button
					disabled
					depressed={ mode === MENU_MODE }
				>
					Menu
				</Button>
				<Button
					onClick={ () => MapControl.activateDrawMode(false) }
					depressed={ mode === DRAW_MODE }
				>
					Draw
				</Button>
			</ButtonGroup>
		);
	}
}
