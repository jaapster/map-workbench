import React from 'react';
import { Location } from '../../types';
import { MapControl } from '../../map-control/map-control';
import { Properties } from './cp-properties';

interface Props {
	locations: Location[];
}

export const Locations = React.memo(({ locations }: Props) => {
	return (
		<Properties>
			<h2>Locations</h2>
			<div className="list">
				{
					locations.map(location => (
						<div
							key={location.title}
							className="list-item"
							onClick={() => MapControl.setLocation(location)}
						>
							{location.title}
						</div>
					))
				}
			</div>
		</Properties>
	);
});
