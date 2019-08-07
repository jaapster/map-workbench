import React from 'react';
import { LanguagePack, State } from '../../types';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { ActionGoToWorld } from '../../reducers/actions';
import {
	worldIds,
	currentWorldId, lang
} from '../../reducers/selectors/index.selectors';
import { RadioButtons } from './cp-radio-buttons';

interface Props {
	lang: LanguagePack;
	worlds: [string, string][];
	setWorld: (worldId: string) => void;
	world: string;
}

export const _WorldSelector = React.memo(({ lang, worlds, world, setWorld }: Props) => (
	<RadioButtons label={ lang.multiverse.worlds } value={ world } options={ worlds } onChange={ setWorld } />
));

const mapStateToProps = (state: State) => (
	{
		lang: lang(state),
		worlds: worldIds(state).map(id => [id, id]) as [string, string][],
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

