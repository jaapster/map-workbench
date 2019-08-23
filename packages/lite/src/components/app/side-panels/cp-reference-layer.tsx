import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { PrimaryMapControl } from 'lite/misc/map-control/primary-map-control';
import { Collapsible } from '../cp-collapsible';
import { RadioButtons } from '../cp-radio-buttons';
import { SecondaryMapControl } from 'lite/misc/map-control/secondary-map-control';
import { ActionSetCurrentReferenceLayer } from 'lite/store/actions/actions';
import {
	lang,
	referenceStyles,
	currentReferenceStyleId } from 'lite/store/selectors/index.selectors';
import {
	State,
	LanguagePack,
	ReferenceStyle } from 'se';

type Foo = [string, ReferenceStyle];

interface Props {
	lang: LanguagePack;
	style: string;
	styles: Foo[];
	setStyle: (style: Foo) => void;
}

export const _ReferenceLayer = React.memo(({ lang, styles, setStyle, style }: Props) => {
	const set = (style: string) => {
		const s = styles.find(([id]) => id === style);

		if (s) {
			setStyle(s);
		}
	};

	return (
		<Collapsible title={ lang.map.referenceLayer }>
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
			PrimaryMapControl.setStyle(style);
			SecondaryMapControl.setStyle(style);

			dispatch(ActionSetCurrentReferenceLayer.create({ layer }));
		}
	}
);

export const ReferenceLayer = connect(mapStateToProps, mapDispatchToProps)(_ReferenceLayer);
