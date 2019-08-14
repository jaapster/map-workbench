import React from 'react';
import { zoom } from '../../store/selectors/index.selectors';
import { State } from '../../types';
import { connect } from 'react-redux';
import { MapControl } from '../../misc/map-control/map-control';
import {
	Button,
	ButtonGroup } from '../app/cp-button';

interface Props {
	zoom: number;
}

export const _ZoomLevel = React.memo(({ zoom }: Props) => (
	<ButtonGroup className="button-group">
		<Button onClick={ MapControl.zoomIn }>
			<i className="icon-plus1" />
		</Button>
		<Button onClick={ MapControl.zoomOut }>
			<i className="icon-minus1" />
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
