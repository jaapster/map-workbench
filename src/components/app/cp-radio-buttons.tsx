import React from 'react';
import './scss/radio-button.scss';
import { mergeClasses } from './utils/util-merge-classes';

interface Props {
	label: string;
	value: string;
	options: [string, string][];
	onChange: (value: any) => void;
}

export const RadioButtons = ({ label, options, value, onChange }: Props) => (
	<div className="radio-buttons">
		<h3>{ label }</h3>
		{
			options.map(([label, val]) => {
				const className = mergeClasses(
					'radio-button',
					{
						selected: val === value
					}
				);

				return (
					<div
						key={ val }
						className={ className }
						onClick={ () => onChange(val) }
					>
						{ label }
					</div>
				);
			})
		}
	</div>
);
