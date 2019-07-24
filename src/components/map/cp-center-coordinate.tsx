import bind from 'autobind-decorator';
import React from 'react';
import { MapControl } from '../../map-control/map-control';

interface Props {
	mapControl: MapControl;
}

@bind
export class CenterCoordinate extends React.Component<Props> {
	componentDidMount() {
		const { mapControl } = this.props;

		mapControl.on('move', this._update);
		mapControl.on('zoom', this._update);
	}

	_update() {
		this.forceUpdate();
	}

	render() {
		const { mapControl } = this.props;
		const { lng, lat } = mapControl.getCenter();

		return (
			<div className="center-coordinate">
				{ lng.toFixed(3) }, { lat.toFixed(3) }
			</div>
		);
	}
}