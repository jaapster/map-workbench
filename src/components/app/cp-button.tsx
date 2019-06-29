import React from 'react';
import './style/cp-button.scss';
import { mergeClasses } from '../../utils/util-merge-classes';

interface Props {
	onClick: () => void;
	depressed?: boolean;
	children: any;
}

export const Button = (props: Props) => {
	const { onClick, depressed, children } = props;

	const className = mergeClasses(
		'button',
		{
			'button-depressed': depressed
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

export const ButtonGroup = (props: { children: any }) => {
	const { children } = props;

	return (
		<div className="button-group">
			{ children }
		</div>
	);
};
