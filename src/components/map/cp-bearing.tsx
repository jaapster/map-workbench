import React from 'react';
import { State } from '../../types';
import { connect } from 'react-redux';
// import { zoom } from '../../reducers/selectors/index.selectors';
import { MapControl } from '../../map-control/map-control';
import { Button, ButtonGroup } from '../app/cp-button';
import { bearing, pitch } from '../../reducers/selectors/index.selectors';

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
					<i className="icon-arrow-up" />
				</div>
			</div>
		</Button>
		{/*<div className="label" style={ { width: 60 } }>*/}
		{/*	{ bearing.toFixed(0) }*/}
		{/*</div>*/}
	</ButtonGroup>
));

const mapStateToProps = (state: State) => (
	{
		pitch: pitch(state),
		bearing: -bearing(state)
	}
);

export const Bearing = connect(mapStateToProps)(_Bearing);
