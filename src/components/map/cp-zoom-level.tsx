import React from 'react';
import { State } from '../../types';
import { connect } from 'react-redux';
import { zoom } from '../../reducers/selectors/index.selectors';
import { MapControl } from '../../map-control/map-control';

interface Props {
	zoom: number;
}

export const _ZoomLevel = React.memo(({ zoom }: Props) => (
	<div className="zoom-controls">
		<div className="zoom-btn" onClick={ MapControl.zoomIn }>
			+
		</div>
		<div className="zoom-btn" onClick={ MapControl.zoomOut }>
			-
		</div>
		<div className="zoom">
			{ zoom.toFixed(2) }
		</div>
	</div>
));

const mapStateToProps = (state: State) => (
	{
		zoom: zoom(state)
	}
);

export const ZoomLevel = connect(mapStateToProps)(_ZoomLevel);
