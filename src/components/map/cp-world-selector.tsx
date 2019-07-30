import React from 'react';
import { connect } from 'react-redux';
import { ActionGoToWorld } from '../../reducers/actions';
import {
	Button,
	ButtonGroup } from '../app/cp-button';
import {
	Dict,
	State,
	WorldData
} from '../../types';
import { Dispatch } from 'redux';

interface Props {
	worlds: Dict<WorldData>;
	currentWorldId: string;
	goToWorld: (worldId: string) => void;
}

export const _WorldSelector = ({ worlds, currentWorldId, goToWorld }: Props) => (
	<ButtonGroup>
		{
			Object.keys(worlds).map((key) => {
				return (
					<Button
						key={ key }
						onClick={ () => goToWorld(key) }
						depressed={ currentWorldId === key }
					>
						{ key }
					</Button>
				);
			})
		}
	</ButtonGroup>
);

const mapStateToProps = (state: State) => (
	{
		currentWorldId: state.multiverse.currentWorldId,
		worlds: state.multiverse.worlds
	}
);

const mapDispatchToProps = (dispatch: Dispatch) => (
	{
		goToWorld(worldId: string) {
			dispatch(ActionGoToWorld.create({ worldId }));
		}
	}
);

export const WorldSelector = connect(mapStateToProps, mapDispatchToProps)(_WorldSelector);

