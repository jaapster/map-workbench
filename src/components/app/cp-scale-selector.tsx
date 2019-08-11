import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Collapsible } from './cp-collapsible';
import { RadioButtons } from './cp-radio-buttons';
import { ActionSetUIScale } from '../../reducers/actions/actions';
import {
	lang,
	scale,
	scales } from '../../reducers/selectors/index.selectors';
import {
	State,
	LanguagePack } from '../../types';

interface Props {
	lang: LanguagePack;
	scale: number;
	scales: number[];
	setScale: (scale: number) => void;
}

export const _ScaleSelector = React.memo(({ lang, scale, scales, setScale }: Props) => (
	<Collapsible title={ lang.settings.uiScale }>
		<RadioButtons
			label={ lang.settings.uiScale }
			value={ scale }
			options={ scales.map(s => [`${ (s * 100) | 0 }%`, s]) }
			onChange={ setScale }
		/>
	</Collapsible>
));

const mapStateToProps = (state: State) => (
	{
		lang: lang(state),
		scale: scale(state),
		scales: scales(state)
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

