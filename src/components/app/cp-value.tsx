import React from 'react';

interface Props {
	value: any;
	unit: string;
	precision: number;
}

export const Value = ({ value, unit, precision = 2 }: any) => {
	let v = value;
	let u = unit;

	if (value != null && !isNaN(value)) {
		if (u === 'm') {
			if (value.toFixed(0).length > 3) {
				v = value / 1000;
				u = 'km';
			} else if (value.toFixed(0).length > 2) {
				v = value / 100;
				u = 'hm';
			}
		} else if (u === 'm2') {
			if (value.toFixed(0).length > 5) {
				v = value / 1000000;
				u = `k${unit}`;
			}
		}
	}

	return (
		<span>
			{
				v == null
					? '-'
					: `${ !isNaN(v) ? v.toFixed(precision) : v }
						${ u  ? ` ${ u }`  : '' }`
			}
		</span>
	);
};