import React from 'react';
import { State } from '../../types';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { ActionGoToWorld } from '../../reducers/actions';
import {
	Button,
	ButtonGroup } from '../app/cp-button';
import {
	worldIds,
	currentWorldId
} from '../../reducers/selectors/index.selectors';
import { StyleSelector } from './cp-style-selector';

interface Props {
	worldIds: string[];
	goToWorld: (worldId: string) => void;
	currentWorldId: string;
}

export const _WorldSelector = React.memo(({ worldIds, currentWorldId, goToWorld }: Props) => (
	<ButtonGroup>
		{
			worldIds.map((id) => {
				return (
					<Button
						key={ id }
						onClick={ () => goToWorld(id) }
						depressed={ currentWorldId === id }
					>
						{ id }
					</Button>
				);
			})
		}
		<StyleSelector />
	</ButtonGroup>
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

export const WorldSelector = connect(mapStateToProps, mapDispatchToProps)(_WorldSelector);

