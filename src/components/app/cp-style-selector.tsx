import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { MapControl } from '../../map-control/map-control';
import { Collapsible } from './cp-collapsible';
import { RadioButtons } from './cp-radio-buttons';
import { OverviewControl } from '../../map-control/overview-control';
import { ActionSetCurrentReferenceLayer } from '../../reducers/actions/actions';
import {
	lang,
	referenceStyles,
	currentReferenceStyleId } from '../../reducers/selectors/index.selectors';
import {
	State,
	LanguagePack,
	ReferenceStyle } from '../../types';

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
		<Collapsible title={ lang.multiverse.referenceLayer }>
			<RadioButtons
				value={ style }
				options={ styles.map(([style]) => [style, style]) as any }
				onChange={ set }
			/>
		</Collapsible>
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
			OverviewControl.setStyle(style);

			dispatch(ActionSetCurrentReferenceLayer.create({ layer }));
		}
	}
);

export const StyleSelector = connect(mapStateToProps, mapDispatchToProps)(_StyleSelector);
