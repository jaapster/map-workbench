import React from 'react';
import { connect } from 'react-redux';
import { MapControl } from '../../map-control/map-control';
import {
	Button,
	ButtonGroup } from '../app/cp-button';
import {
	MapControlData,
	MapControlMode } from '../../types';
import {
	DRAW_MODE,
	MENU_MODE,
	UPDATE_MODE,
	NAVIGATION_MODE } from '../../constants';

interface Props {
	mode: MapControlMode;
}

export const _ModeSelector = ({ mode }: Props) => (
	<ButtonGroup>
		<Button
			onClick={ MapControl.activateNavigationMode }
			depressed={ mode === NAVIGATION_MODE }
		>
			Navigate
		</Button>
		<Button
			disabled
			depressed={ mode === UPDATE_MODE }
		>
			Update
		</Button>
		<Button
			disabled
			depressed={ mode === MENU_MODE }
		>
			Menu
		</Button>
		<Button
			onClick={ () => MapControl.activateDrawMode() }
			depressed={ mode === DRAW_MODE }
		>
			Draw
		</Button>
	</ButtonGroup>
);

const mapStateToProps = (state: { mapControl: MapControlData }) => (
	{
		mode: state.mapControl.mode
	}
);

export const ModeSelector = connect(mapStateToProps)(_ModeSelector);
