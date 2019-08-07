import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { MapControl } from '../../map-control/map-control';
import { RadioButtons } from './cp-radio-buttons';
import { ActionSetCurrentReferenceLayer } from '../../reducers/actions';
import {
	referenceStyles,
	currentReferenceStyleId, lang
} from '../../reducers/selectors/index.selectors';
import {
	State,
	ReferenceStyle, LanguagePack
} from '../../types';

type Foo = [string, ReferenceStyle];

interface Props {
	lang: LanguagePack;
	style: string;
	styles: Foo[];
	setStyle: (style: Foo) => void;
}

export const _StyleSelector = React.memo(({ lang, styles, setStyle, style }: Props) => {
	const set = (style: string) => {
		const s = styles.find(([id]) => id === style);

		if (s) {
			setStyle(s);
		}
	};

	return (
		<RadioButtons
			label={ lang.multiverse.referenceLayer }
			value={ style }
			options={ styles.map(([style]) => [style, style]) as [string, string][] }
			onChange={ set }
		/>
	);
});

const mapStateToProps = (state: State) => (
	{
		lang: lang(state),
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
