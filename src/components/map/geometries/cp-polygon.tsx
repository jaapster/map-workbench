import React from 'react';
import { extent } from '../../../reducers/selectors/index.selectors';
import { connect } from 'react-redux';
import { Segments } from '../cp-segments';
import { addToPath } from '../utils/util-add-to-path';
import { mergeClasses } from '../../app/utils/util-merge-classes';
import {
	Co,
	State } from '../../../types';

interface Props {
	id: string;
	selected: boolean;
	coordinates: Co[][];
}

export const _Polygon = React.memo(({ id, coordinates, selected }: Props) => {
	const className = mergeClasses(
		'polygon',
		{
			selected
		}
	);

	return (
		<g>
			<path
				fillRule="evenodd"
				className={ className }
				d={
					coordinates.reduce((m, c) => c.reduce(addToPath, m), '')
				}
			/>
			{
				selected
					? (
						<Segments
							id={ id }
							coordinates={ coordinates }
							selected={ selected }
						/>
					)
					: null
			}
		</g>
	);
});

const mapStateToProps = (state: State) => (
	{
		extent: extent(state)
	}
);

export const Polygon = connect(mapStateToProps)(_Polygon);
