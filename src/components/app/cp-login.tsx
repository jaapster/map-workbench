import React, { useState } from 'react';
import './scss/login.scss';
import { Button } from './cp-button';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { ActionAuthenticate } from '../../store/actions/actions';
import { mergeClasses } from '../../utils/util-merge-classes';
import { State } from '../../types';
import { authenticationError } from '../../store/selectors/index.selectors';

interface Props {
	login: (userName: string, password: string) => void;
	authenticationError: null | string;
}

export const _Login = React.memo(({ login, authenticationError }: Props) => {
	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');

	const active = userName && password;

	const onUserNameChange = (e: any) => setUserName(e.target.value);
	const onPasswordChange = (e: any) => setPassword(e.target.value);
	const onKeyDown = (e: any) => {
		if (e.key === 'Enter' && active) {
			login(userName, password);
		}
	};

	const className = mergeClasses(
		'button-login',
		{
			active
		}
	);

	return (
		<div className="login">
			<div className="login-panel">
				<h2>[login.title]</h2>
				{
					authenticationError
						? (
							<div className="error">
								{ authenticationError }
							</div>
						)
						: null
				}
				<div>
					<input
						type="text"
						onChange={ onUserNameChange }
						onKeyDown={ onKeyDown }
						placeholder="username"
					/>
				</div>
				<div>
					<input
						type="password"
						onChange={ onPasswordChange }
						onKeyDown={ onKeyDown }
						placeholder="password"
					/>
				</div>
				<Button
					className={ className }
					onClick={ () => login(userName, password) }
					disabled={ !active }
				>
					[login.submit]
				</Button>
			</div>
		</div>
	);
});

const mapStateToProps = (state: State) => (
	{
		authenticationError: authenticationError(state)
	}
);

const mapDispatchToProps = (dispatch: Dispatch) => (
	{
		login(userName: string, password: string) {
			// @ts-ignore
			dispatch(ActionAuthenticate.create({ userName, password }));
		}
	}
);

export const Login = connect(mapStateToProps, mapDispatchToProps)(_Login);
