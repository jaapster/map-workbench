import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RadioButtons } from './cp-radio-buttons';
import { ActionGoToWorld } from '../../reducers/actions';
import {
	lang,
	worlds,
	currentWorldId } from '../../reducers/selectors/index.selectors';
import {
	State,
	LanguagePack, WorldData
} from '../../types';

interface Props {
	lang: LanguagePack;
	world: string;
	worlds: WorldData[];
	setWorld: (worldId: string) => void;
}

export const _WorldSelector = React.memo(({ lang, worlds, world, setWorld }: Props) => (
	<RadioButtons
		label={ lang.multiverse.worlds }
		value={ world }
		options={ worlds.map(world => [world.id, world.id]) as any }
		onChange={ setWorld }
	/>
));

const mapStateToProps = (state: State) => (
	{
		lang: lang(state),
		world: currentWorldId(state),
		worlds: worlds(state)
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

