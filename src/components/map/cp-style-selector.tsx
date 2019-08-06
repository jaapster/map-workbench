import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { MapControl } from '../../map-control/map-control';
import { ActionSetCurrentReferenceLayer } from '../../reducers/actions';
import {
	referenceStyles,
	currentReferenceStyleId } from '../../reducers/selectors/index.selectors';
import {
	Button,
	ButtonGroup } from '../app/cp-button';
import {
	State,
	ReferenceStyle } from '../../types';

interface Props {
	setStyle: (style: [string, ReferenceStyle]) => void;
	referenceStyles: [string, ReferenceStyle][];
	currentReferenceStyleId: ReferenceStyle;
}

export const _StyleSelector = ({ referenceStyles, setStyle, currentReferenceStyleId }: Props) => (
	<ButtonGroup>
		{
			referenceStyles.map(([id, s]) => (
				<Button
					key={ id }
					onClick={ () => setStyle([id, s]) }
					depressed={  currentReferenceStyleId === id }
				>
					{ id }
				</Button>
			))
		}
	</ButtonGroup>
);

const mapStateToProps = (state: State) => (
	{
		referenceStyles: referenceStyles(state),
		currentReferenceStyleId: currentReferenceStyleId(state)
	}
);

const mapDispatchToProps = (dispatch: Dispatch) => (
	{
		setStyle([layer, style]: [string, ReferenceStyle]) {
			MapControl.setStyle(style);
			dispatch(ActionSetCurrentReferenceLayer.create({ layer }));
		}
	}
);

export const StyleSelector = connect(mapStateToProps, mapDispatchToProps)(_StyleSelector);
