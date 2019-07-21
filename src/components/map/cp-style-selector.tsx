import bind from 'autobind-decorator';
import React from 'react';
import { MapControl } from '../../map-control/map-control';
import { Button, ButtonGroup } from '../app/cp-button';
import { styles } from '../../map-control/utils/util-map';

interface Props {
	mapControl: MapControl;
}

interface State {
	style: string;
}

@bind
export class StyleSelector extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			style: styles[0][1]
		};
	}

	private _setStyle(_style: string) {
		const { mapControl } = this.props;
		const { style } = this.state;

		if (style !== _style) {
			mapControl.setStyle(_style);
			this.setState({ style: _style });
		}
	}

	render() {
		const { style } = this.state;

		return (
			<ButtonGroup>
				{
					styles.map(([name, url]) => (
						<Button
							key={ name }
							onClick={ () => this._setStyle(url) }
							disabled={ styles.length === 1 }
							depressed={ style === url }
						>
							{ name }
						</Button>
					))
				}
			</ButtonGroup>
		);
	}
}
