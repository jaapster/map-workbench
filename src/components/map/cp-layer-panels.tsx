import React from 'react';
import { LayerPanel } from '../app/cp-layer-panel';

export class LayerPanels extends React.PureComponent {
	render() {
		return (
			<div className="side-panel">
				<LayerPanel />
			</div>
		);
	}
}
