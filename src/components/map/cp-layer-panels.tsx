import React from 'react';
import { LayerPanel } from '../app/cp-layer-panel';
import { ServiceGeoNote } from '../../services/service.geo-note';
import { UniverseService } from '../../services/service.universe';
import { MessageService } from '../../services/service.message';

export class LayerPanels extends React.Component {
	componentDidMount() {
		MessageService.on('update:world', this._update);
	}

	private _update() {
		this.forceUpdate();
	}

	render() {
		const models = [
			UniverseService.getCurrentWorld().trails,
			ServiceGeoNote.getModel()
		];

		return (
			<div className="side-panel">
				{
					models.map(model => (
						<LayerPanel
							key={model.getTitle()}
							model={model}
						/>
					))
				}
			</div>
		);
	}
}
