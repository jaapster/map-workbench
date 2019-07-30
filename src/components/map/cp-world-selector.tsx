import React from 'react';
import { connect } from 'react-redux';
import { dispatch } from '../../reducers/store';
import { ActionGoToWorld } from '../../reducers/actions';
import {
	Button,
	ButtonGroup } from '../app/cp-button';
import {
	Dict,
	WorldData,
	MultiverseData } from '../../types';

interface Props {
	worlds: Dict<WorldData>;
	currentWorldId: string;
}

export const _WorldSelector = ({ worlds, currentWorldId }: Props) => (
	<ButtonGroup>
		{
			Object.keys(worlds).map((key) => {
				return (
					<Button
						key={ key }
						onClick={ () => dispatch(ActionGoToWorld.create({ worldId: key })) }
						depressed={ currentWorldId === key }
					>
						{ key }
					</Button>
				);
			})
		}
	</ButtonGroup>
);

const mapStateToProps = (state: { multiverse: MultiverseData }) => (
	{
		currentWorldId: state.multiverse.currentWorldId,
		worlds: state.multiverse.worlds
	}
);

export const WorldSelector = connect(mapStateToProps)(_WorldSelector);

