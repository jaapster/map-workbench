import React from 'react';
import { Co } from '../../types';
import { coToLl } from '../../map-control/utils/util-geo';
import { MapControl } from '../../map-control/map-control';

interface Props {
	animate: boolean;
	coordinates: Co;
}

export const SelectedVertex = ({ coordinates, animate }: Props) => {
	const { x, y } = MapControl.project(coToLl(coordinates));

	return (
		<g>
			<circle
				r="10"
				cx={ x }
				cy={ y }
				className="vertex-selected"
			>
				{
					animate
						? (
							<>
								<animate
									dur="1.2s"
									values="0;10;0"
									attributeName="r"
									repeatCount="indefinite"
								/>
							</>
						)
						: null
				}
			</circle>
		</g>
	);
};
