import React from 'react';
import { LayerPanel } from '../app/cp-layer-panel';
import { TrailService } from '../../services/trail.service';
import { GeoNoteService } from '../../services/geo-note.service';

export const LayerPanels = () => {
	const models = [
		TrailService.getModel(),
		GeoNoteService.getModel()
	];

	return (
		<>
			{
				models.map(model => (
					<LayerPanel
						key={ model.getTitle() }
						model={ model }
					/>
				))
			}
		</>
	);
};
