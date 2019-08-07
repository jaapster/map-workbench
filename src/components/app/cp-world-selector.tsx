import React from 'react';
import { State } from '../../types';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { ActionGoToWorld } from '../../reducers/actions';
import {
	worldIds,
	currentWorldId } from '../../reducers/selectors/index.selectors';
import { RadioButtons } from './cp-radio-buttons';

interface Props {
	worlds: [string, string][];
	setWorld: (worldId: string) => void;
	world: string;
}

export const _WorldSelector = React.memo(({ worlds, world, setWorld }: Props) => (
	<RadioButtons label="Worlds" value={ world } options={ worlds } onChange={ setWorld } />
));

const mapStateToProps = (state: State) => (
	{
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

