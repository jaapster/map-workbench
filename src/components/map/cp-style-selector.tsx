import bind from 'autobind-decorator';
import React from 'react';
import { MapControl } from '../../map-control/map-control';
import { Button, ButtonGroup } from '../app/cp-button';
import { styles } from '../../map-control/utils/util-map';

interface Props {}

interface State {
	style: string;
}

@bind
export class StyleSelector extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			style: styles[0][1]
		};
	}

	private _setStyle(_style: string) {
		const { style } = this.state;

		if (style !== _style) {
			MapControl.setStyle(_style);
			this.setState({ style: _style });
		}
	}

	render() {
		const { style } = this.state;

		return (
			<ButtonGroup>
				{
					styles.map(([name, s]) => (
						<Button
							key={ name }
							onClick={ () => this._setStyle(s) }
							disabled={ styles.length === 1 }
							depressed={ style === s }
						>
							{ name }
						</Button>
					))
				}
			</ButtonGroup>
		);
	}
}
