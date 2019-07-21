import React from 'react';
import { Location } from '../../types';
import { MapControl } from '../../map-control/map-control';

interface Props {
	locations: Location[];
}

export const Locations = ({ locations }: Props) => (
	<div className="side">
		<h2>Locations</h2>
		{
			locations.map(location => (
				<div
					key={ location.title }
					className="feature"
					onClick={ () => MapControl.setLocation(location) }
				>
					{ location.title }
				</div>
			))
		}
	</div>
);
