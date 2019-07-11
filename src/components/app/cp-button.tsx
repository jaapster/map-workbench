import React from 'react';
import './style/cp-button.scss';
import { mergeClasses } from '../../utils/util-merge-classes';

interface Props {
	onClick?: () => void;
	depressed?: boolean;
	disabled?: boolean;
	children: any;
}

export const Button = (props: Props) => {
	const { onClick = () => 0, depressed, disabled, children } = props;

	const className = mergeClasses(
		'button',
		{
			'button-depressed': depressed,
			'button-disabled': disabled
		}
	);

	return (
		<button
			className={ className }
			onClick={ onClick }
		>
			{ children }
		</button>
	);
};

export const ButtonGroup = (props: { children: any, title: string }) => {
	const { children, title } = props;

	return (
		<div className="button-group">
			<div className="button-group-title">
				{ title }
			</div>
			<div>
				{ children }
			</div>
		</div>
	);
};
