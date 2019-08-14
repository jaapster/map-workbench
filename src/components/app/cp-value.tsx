import React from 'react';
import { connect } from 'react-redux';
import { unitSystem } from '../../store/selectors/index.selectors';
import {
	mToFt,
	m2ToFt2,
	mToDisplay,
	ftToDisplay,
	m2ToDisplay,
	ft2ToDisplay } from '../../utils/util-conversion';
import {
	M,
	M2,
	METRIC } from '../../constants/constants';
import {
	State,
	UnitSystem } from '../../types';

interface Props {
	unit?: string;
	value: any;
	unitSystem?: UnitSystem;
}

export const _Value = React.memo(({ value, unit, unitSystem }: Props) => (
	<span>
		{
			value == null
				? '-'
				: isNaN(value)
					? `${ value }`
					: unit === M
						? unitSystem === METRIC
							? mToDisplay(value)
							: ftToDisplay(mToFt(value))
						: unit === M2
							? unitSystem === METRIC
								? m2ToDisplay(value)
								: ft2ToDisplay(m2ToFt2(value))
							: `${ value }`

		}
	</span>
));

const mapStateToProps = (state: State) => (
	{
		unitSystem: unitSystem(state)
	}
);

export const Value = connect(mapStateToProps)(_Value);
