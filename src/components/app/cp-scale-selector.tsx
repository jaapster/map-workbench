import React from 'react';
import { State } from '../../types';
import { scale } from '../../reducers/selectors/index.selectors';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RadioButtons } from './cp-radio-buttons';
import { ActionSetUIScale } from '../../reducers/actions';

interface Props {
	scale: number;
	scales: [string, number][];
	setScale: (UIScale: number) => void;
}

export const _ScaleSelector = React.memo(({ scale, scales, setScale }: Props) => (
	<RadioButtons
		label="UI Scale"
		value={ scale }
		options={ scales }
		onChange={ setScale }
	/>
));

const scales: [string, number][] = [['100%', 1], ['120%', 1.2], ['150%', 1.5], ['200%', 2]];

const mapStateToProps = (state: State) => (
	{
		scale: scale(state),
		scales
	}
);

const mapDispatchToProps = (dispatch: Dispatch) => (
	{
		setScale(UIScale: number) {
			dispatch(ActionSetUIScale.create({ UIScale }));
		}
	}
);

export const ScaleSelector = connect(mapStateToProps, mapDispatchToProps)(_ScaleSelector);

