import bind from 'autobind-decorator';
import React from 'react';
import { MapControl } from '../../map-control/map-control';
import { MessageService } from '../../services/service.message';

interface Props {}

@bind
export class ZoomLevel extends React.Component<Props> {
	componentDidMount() {
		MessageService.on('update:zoom', this._update);
	}

	componentWillUnmount() {
		MessageService.off('update:zoom', this._update);
	}

	private _update() {
		this.forceUpdate();
	}

	render() {
		const zoom = MapControl.getZoom();

		return (
			<div className="zoom">
				{ zoom.toFixed(2) }
			</div>
		);
	}
}
