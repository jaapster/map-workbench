import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RadioButtons } from './cp-radio-buttons';
import { ActionGoToWorld } from '../../reducers/actions';
import {
	lang,
	worldOptions,
	currentWorldId } from '../../reducers/selectors/index.selectors';
import {
	State,
	LanguagePack } from '../../types';

interface Props {
	lang: LanguagePack;
	worldOptions: [string, string][];
	setWorld: (worldId: string) => void;
	world: string;
}

export const _WorldSelector = React.memo(({ lang, worldOptions, world, setWorld }: Props) => (
	<RadioButtons
		label={ lang.multiverse.worlds }
		value={ world }
		options={ worldOptions }
		onChange={ setWorld }
	/>
));

const mapStateToProps = (state: State) => (
	{
		lang: lang(state),
		worldOptions: worldOptions(state),
		world: currentWorldId(state)
	}
);

const mapDispatchToProps = (dispatch: Dispatch) => (
	{
		setWorld(worldId: string) {
			dispatch(ActionGoToWorld.create({ worldId }));
		}
	}
);

export const WorldSelector = connect(mapStateToProps, mapDispatchToProps)(_WorldSelector);

