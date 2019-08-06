import React from 'react';
import { State } from '../../types';
import { connect } from 'react-redux';
import { zoom } from '../../reducers/selectors/index.selectors';
import { MapControl } from '../../map-control/map-control';
import { Button, ButtonGroup } from '../app/cp-button';

interface Props {
	zoom: number;
}

export const _ZoomLevel = React.memo(({ zoom }: Props) => (
	<ButtonGroup className="button-group">
		<Button onClick={ MapControl.zoomIn }>
			+
		</Button>
		<Button onClick={ MapControl.zoomOut }>
			-
		</Button>
		<div className="label">
			{ zoom.toFixed(2) }
		</div>
	</ButtonGroup>
));

const mapStateToProps = (state: State) => (
	{
		zoom: zoom(state)
	}
);

export const ZoomLevel = connect(mapStateToProps)(_ZoomLevel);
