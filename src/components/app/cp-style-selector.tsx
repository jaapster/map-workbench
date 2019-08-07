import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { MapControl } from '../../map-control/map-control';
import { RadioButtons } from './cp-radio-buttons';
import { ActionSetCurrentReferenceLayer } from '../../reducers/actions';
import {
	referenceStyles,
	currentReferenceStyleId } from '../../reducers/selectors/index.selectors';
import {
	State,
	ReferenceStyle } from '../../types';

type Foo = [string, ReferenceStyle];

interface Props {
	style: string;
	styles: Foo[];
	setStyle: (style: Foo) => void;
}

export const _StyleSelector = ({ styles, setStyle, style }: Props) => {
	const set = (style: string) => {
		const s = styles.find(([id]) => id === style);

		if (s) {
			setStyle(s);
		}
	};

	return (
		<RadioButtons
			label="Reference layer"
			value={ style }
			options={ styles.map(([style]) => [style, style]) as [string, string][] }
			onChange={ set }
		/>
	);
};

const mapStateToProps = (state: State) => (
	{
		style: currentReferenceStyleId(state) as string,
		styles: referenceStyles(state)
	}
);

const mapDispatchToProps = (dispatch: Dispatch) => (
	{
		setStyle([layer, style]: Foo) {
			MapControl.setStyle(style);
			dispatch(ActionSetCurrentReferenceLayer.create({ layer }));
		}
	}
);

export const StyleSelector = connect(mapStateToProps, mapDispatchToProps)(_StyleSelector);