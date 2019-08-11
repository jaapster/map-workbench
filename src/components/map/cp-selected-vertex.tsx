import React from 'react';
import { extent } from '../../reducers/selectors/index.selectors';
import { connect } from 'react-redux';
import { MapControl } from '../../map-control/map-control';
import {
	Co,
	State } from '../../types';

interface Props {
	animate: boolean;
	coordinates: Co;
}

export const _SelectedVertex = React.memo(({ coordinates, animate }: Props) => {
	const { x, y } = MapControl.project(coordinates);

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
});

const mapStateToProps = (state: State) => (
	{
		extent: extent(state)
	}
);

export const SelectedVertex = connect(mapStateToProps)(_SelectedVertex);
