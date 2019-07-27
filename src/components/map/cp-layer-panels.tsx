import React from 'react';
import { LayerPanel } from '../app/cp-layer-panel';
import { ServiceGeoNote } from '../../services/service.geo-note';
import { UniverseService } from '../../services/service.universe';

export const LayerPanels = () => {
	const models = [
		UniverseService.getCurrentWorld().trails,
		ServiceGeoNote.getModel()
	];

	return (
		<div className="side-panel">
			{
				models.map(model => (
					<LayerPanel
						key={ model.getTitle() }
						model={ model }
					/>
				))
			}
		</div>
	);
};
