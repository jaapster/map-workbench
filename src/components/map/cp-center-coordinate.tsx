import bind from 'autobind-decorator';
import React from 'react';
import { MapControl } from '../../map-control/map-control';
import { MessageService } from '../../services/service.message';

interface Props {}

@bind
export class CenterCoordinate extends React.Component<Props> {
	componentDidMount() {
		MessageService.on('update:center', this._update);
		MessageService.on('update:zoom', this._update);
	}

	componentWillUnmount() {
		MessageService.off('update:center', this._update);
		MessageService.off('update:zoom', this._update);
	}

	_update() {
		this.forceUpdate();
	}

	render() {
		const [x, y] = MapControl.getCenter();

		const hasDecimals = Math.round(x) !== x;

		return (
			<div className="center-coordinate">
				{
					hasDecimals ? x.toFixed(6) : x
				}, {
					hasDecimals ? y.toFixed(6) : y
				}
			</div>
		);
	}
}
