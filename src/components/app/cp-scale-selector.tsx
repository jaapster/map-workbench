import React from 'react';
import { LanguagePack, State } from '../../types';
import { lang, scale } from '../../reducers/selectors/index.selectors';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RadioButtons } from './cp-radio-buttons';
import { ActionSetUIScale } from '../../reducers/actions';

interface Props {
	lang: LanguagePack;
	scale: number;
	scales: [string, number][];
	setScale: (UIScale: number) => void;
}

export const _ScaleSelector = React.memo(({ lang, scale, scales, setScale }: Props) => (
	<RadioButtons
		label={ lang.settings.uiScale }
		value={ scale }
		options={ scales }
		onChange={ setScale }
	/>
));

const scales: [string, number][] = [['80%', 0.8], ['90%', 0.9], ['100%', 1], ['110%', 1.1], ['120%', 1.2], ['130%', 1.3]];

const mapStateToProps = (state: State) => (
	{
		lang: lang(state),
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

