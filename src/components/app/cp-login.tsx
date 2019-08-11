import React from 'react';
import { Button } from './cp-button';
import { Dispatch } from 'redux';
import { ActionAuthorize } from '../../reducers/actions/actions';
import { connect } from 'react-redux';

interface Props {
	authorize: () => void;
}

export const _Login = ({ authorize }: Props) => {
	return (
		<div className="login-panel">
			<h2>## LOGIN</h2>
			<Button onClick={ authorize }>AUTH</Button>
		</div>
	);
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Dispatch) => (
	{
		authorize() {
			dispatch(ActionAuthorize.create({}));
		}
	}
);

export const Login = connect(mapStateToProps, mapDispatchToProps)(_Login);
