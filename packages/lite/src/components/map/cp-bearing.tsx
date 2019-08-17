import React from 'react';
import { State } from 'se';
import { connect } from 'react-redux';
import { MapControl } from 'lite/misc/map-control/map-control';
import { Button, ButtonGroup } from 'lite/components/app/cp-button';
import { bearing, pitch } from 'lite/store/selectors/index.selectors';

interface Props {
	pitch: number;
	bearing: number;
}

const reset = () => {
	MapControl.setBearing(0);
	MapControl.setPitch(0);
};

export const _Bearing = React.memo(({ pitch, bearing }: Props) => (
	<ButtonGroup className="button-group">
		<Button onClick={ reset }>
			<div style={ { transform: `scaleY(${ 1 - (pitch / 120) })` } }>
				<div style={ { transform: `rotate(${ bearing }deg)` } }>
					<i className="icon-navigation-2" />
				</div>
			</div>
		</Button>
	</ButtonGroup>
));

const mapStateToProps = (state: State) => (
	{
		pitch: pitch(state),
		bearing: -bearing(state)
	}
);

export const Bearing = connect(mapStateToProps)(_Bearing);
