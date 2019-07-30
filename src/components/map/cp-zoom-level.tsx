import React from 'react';
import { State } from '../../types';
import { connect } from 'react-redux';

interface Props {
	zoom: number;
}

export const _ZoomLevel = React.memo(({ zoom }: Props) => (
	<div className="zoom">
		{ zoom.toFixed(2) }
	</div>
));

const mapStateToProps = (state: State) => (
	{
		zoom: state.mapControl.zoom
	}
);

export const ZoomLevel = connect(mapStateToProps)(_ZoomLevel);
