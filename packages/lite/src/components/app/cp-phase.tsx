import React from 'react';
import { State } from 'se';
import { connect } from 'react-redux';
import { appPhase } from 'lite/store/selectors/index.selectors';

interface Props {
	appPhase: string;
}

export const _AppPhase = React.memo(({ appPhase }: Props) => (
	<div style={ { position: 'absolute', zIndex: 999999999, top: 100 } }>
		{ appPhase }
	</div>
));

const mapStateToProps = (state: State): Props => (
	{
		appPhase: appPhase(state)
	}
);

export const AppPhase = connect(mapStateToProps)(_AppPhase);
