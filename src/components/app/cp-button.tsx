import React from 'react';
import './scss/button.scss';
import { mergeClasses } from './utils/util-merge-classes';

interface Props {
	onClick?: (e: any) => void;
	children: any;
	disabled?: boolean;
	depressed?: boolean;
	className?: string;
}

export const Button = (props: Props) => {
	const { onClick = () => 0, depressed, disabled, children, className } = props;

	const _className = mergeClasses(
		className,
		'button',
		{
			'button-depressed': depressed,
			'button-disabled': disabled
		}
	);

	return (
		<div
			onClick={ onClick }
			className={ _className }
		>
			{ children }
		</div>
	);
};

export const ButtonGroup = (props: any) => {
	const { children } = props;

	return (
		<div className="button-group">
			{ children }
		</div>
	);
};
