import bind from 'autobind-decorator';
import React from 'react';
import { MapControl } from '../../map-control/map-control';

interface Props {
	mapControl: MapControl;
}

@bind
export class ZoomLevel extends React.Component<Props> {
	componentDidMount() {
		const { mapControl } = this.props;

		mapControl.on('zoom', this._update);
	}

	_update() {
		this.forceUpdate();
	}

	render() {
		const { mapControl } = this.props;
		const zoom = mapControl.getZoom();

		return (
			<div className="zoom">
				{ zoom.toFixed(2) }
			</div>
		);
	}
}
