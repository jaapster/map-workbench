import { Co } from '../../types';
import { MapControl } from '../../map-control/map-control';
import { coToLl } from '../../map-control/utils/util-geo';
import React from 'react';

interface Props {
	coordinates: Co;
}

export const SelectedVertex = ({ coordinates }: Props) => {
	const { x, y } = MapControl.project(coToLl(coordinates));

	return (
		<g>
			<circle
				className="vertex-selected"
				cx={ x }
				cy={ y }
				r="10"
			>
				<animate
					attributeName="r"
					values="0;10;0"
					dur="1.5s"
					repeatCount="indefinite"
				/>
			</circle>
		</g>
	);
};
