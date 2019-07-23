import bind from 'autobind-decorator';
import React from 'react';
import { MapControl } from '../../map-control/map-control';
import { Button, ButtonGroup } from '../app/cp-button';
import {
	DRAW_MODE,
	MENU_MODE,
	UPDATE_MODE,
	NAVIGATION_MODE
} from '../../constants';

interface Props {
	mapControl: MapControl;
}

@bind
export class ModeSelector extends React.Component<Props> {
	componentDidMount() {
		const { mapControl } = this.props;

		mapControl.on('modeChange', this._update);
	}

	_update() {
		this.forceUpdate();
	}

	render() {
		const { mapControl } = this.props;
		const mode = mapControl.getMode();

		return (
			<ButtonGroup>
				<Button
					onClick={ mapControl.activateNavigationMode }
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
					onClick={ () => mapControl.activateDrawMode(false) }
					depressed={ mode === DRAW_MODE }
				>
					Draw
				</Button>
			</ButtonGroup>
		);
	}
}
