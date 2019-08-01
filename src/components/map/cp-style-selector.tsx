import React from 'react';
import { connect } from 'react-redux';
import { MapControl } from '../../map-control/map-control';
import {
	currentReferenceLayer,
	referenceLayers
} from '../../reducers/selectors/index.selectors';
import {
	Button,
	ButtonGroup } from '../app/cp-button';
import {
	State,
	MapboxStyle } from '../../types';
import { Dispatch } from 'redux';
import { ActionSetCurrentReferenceLayer } from '../../reducers/actions';

interface Props {
	currentReferenceLayer: string | MapboxStyle;
	referenceLayers: [string, (string | MapboxStyle)][];
	setStyle: (style: [string, string | MapboxStyle]) => void;
}

export const _StyleSelector = ({ referenceLayers, setStyle, currentReferenceLayer }: Props) => {
	return (
		<ButtonGroup>
			{
				referenceLayers.map(([name, s]) => (
					<Button
						key={ name }
						onClick={ () => setStyle([name, s]) }
						depressed={  currentReferenceLayer === name }
					>
						{ name }
					</Button>
				))
			}
		</ButtonGroup>
	);
};

const mapStateToProps = (state: State) => (
	{
		referenceLayers: referenceLayers(state),
		currentReferenceLayer: currentReferenceLayer(state)
	}
);

const mapDispatchToProps = (dispatch: Dispatch) => (
	{
		setStyle([name, s]: [string, string | MapboxStyle]) {
			MapControl.setStyle(s);
			dispatch(ActionSetCurrentReferenceLayer.create({ layer: name }));
		}
	}
);

export const StyleSelector = connect(mapStateToProps, mapDispatchToProps)(_StyleSelector);
