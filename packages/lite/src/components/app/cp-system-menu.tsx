import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { ActionLogout } from 'lite/store/actions/actions';
import {
	Button,
	ButtonGroup } from './cp-button';

interface Props {
	logout: () => void;
}

export const _SystemMenu = ({ logout }: Props) => (
	<ButtonGroup>
		<Button onClick={ logout }>
			<i className="icon-user1" />
		</Button>
	</ButtonGroup>
);

const mapDispatchToProps = (dispatch: Dispatch): Props => (
	{
		logout() {
			dispatch(ActionLogout.create({}));
		}
	}
);

export const SystemMenu = connect(null, mapDispatchToProps)(_SystemMenu);
