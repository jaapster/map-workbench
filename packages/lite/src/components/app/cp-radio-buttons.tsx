import React from 'react';
import './scss/radio-button.scss';
import { mergeClasses } from 'lite/utils/util-merge-classes';

interface Props {
	value: any;
	options: [string, any][];
	onChange: (value: any) => void;
}

export const RadioButtons = React.memo(({ options, value, onChange }: Props) => (
	<div className="radio-buttons">
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
));
