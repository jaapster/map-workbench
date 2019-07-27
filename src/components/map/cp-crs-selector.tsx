import bind from 'autobind-decorator';
import React from 'react';
import { MapControl } from '../../map-control/map-control';
import { Button, ButtonGroup } from '../app/cp-button';
import {
	PROJECTED,
	GEOGRAPHIC } from '../../constants';
import { MessageService } from '../../services/service.message';

interface Props {}

@bind
export class CRSSelector extends React.Component<Props> {
	componentDidMount() {
		MessageService.on('update:crs', this._update);
	}

	componentWillUnmount() {
		MessageService.off('update:crs', this._update);
	}

	_update() {
		this.forceUpdate();
	}

	render() {
		const crs = MapControl.getCRS();

		return (
			<ButtonGroup>
				<Button
					onClick={ () => MapControl.activateProjectedCRS() }
					depressed={ crs === PROJECTED }
				>
					{ PROJECTED }
				</Button>
				<Button
					onClick={ () => MapControl.activateGeographicCRS() }
					depressed={ crs === GEOGRAPHIC }
				>
					{ GEOGRAPHIC }
				</Button>
			</ButtonGroup>
		);
	}
}
