import React from 'react';
import './scss/checklist.scss';
import { mergeClasses } from 'lite/utils/util-merge-classes';

interface Props {
	options: [string, any, boolean][];
	onChange: (value: any) => void;
}

export const Checklist = React.memo(({ options, onChange }: Props) => (
	<div className="checklist">
		{
			options.map(([label, val, checked]) => {
				const className = mergeClasses(
					'checkbox',
					{
						selected: checked
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
