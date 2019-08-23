import bind from 'autobind-decorator';
import React from 'react';
import { PrimaryMapControl } from '../../misc/map-control/primary-map-control';
import { MapboxStyle } from 'se';
import { SecondaryMapControl } from 'lite/misc/map-control/secondary-map-control';

interface Props {
	style: MapboxStyle;
	control: PrimaryMapControl | SecondaryMapControl;
}

@bind
export class StyleRenderer extends React.PureComponent<Props> {
	private _addStyle() {
		const { style, control } = this.props;

		control.addStyle(style);
	}

	private _removeStyle() {
		const { style, control } = this.props;

		control.removeStyle(style);
	}

	componentDidMount() {
		const { control } = this.props;

		this._addStyle();

		control.on('style-loaded', this._addStyle);
	}

	componentWillUnmount() {
		const { control } = this.props;

		this._removeStyle();

		control.off('style-loaded', this._addStyle);
	}

	render() {
		return null;
	}
}
