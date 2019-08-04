import React from 'react';
import { Co, State } from '../../types';
import { MapControl } from '../../map-control/map-control';
import { center } from '../../reducers/selectors/index.selectors';
import { connect } from 'react-redux';

interface Props {
	animate: boolean;
	center: Co;
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

const mapStateToProps = (state: State) => {
	return {
		center: center(state)
	};
};

export const SelectedVertex = connect(mapStateToProps)(_SelectedVertex);
