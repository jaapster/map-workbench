import React from 'react';
import { State } from '../../types';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Properties } from './cp-properties';
import { StyleSelector } from './cp-style-selector';
import { ActionGoToWorld } from '../../reducers/actions';
import { WorldSelector } from './cp-world-selector';
import {
	worldIds,
	currentWorldId } from '../../reducers/selectors/index.selectors';

interface Props {
	worldIds: string[];
	goToWorld: (worldId: string) => void;
	currentWorldId: string;
}

export const _MultiverseSettings = React.memo(({ worldIds, currentWorldId, goToWorld }: Props) => (
	<Properties>
		<h2>Multiverse</h2>
		<WorldSelector />
		<StyleSelector />
	</Properties>

));

const mapStateToProps = (state: State) => (
	{
		worldIds: worldIds(state),
		currentWorldId: currentWorldId(state)
	}
);

const mapDispatchToProps = (dispatch: Dispatch) => (
	{
		goToWorld(worldId: string) {
			dispatch(ActionGoToWorld.create({ worldId }));
		}
	}
);

export const MultiverseSettings = connect(mapStateToProps, mapDispatchToProps)(_MultiverseSettings);

