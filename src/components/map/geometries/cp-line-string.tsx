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
	coordinates: Co[];
}

export const _LineString = React.memo(({ coordinates, selected, id }: Props) => {
	const className = mergeClasses(
		'line',
		{
			selected
		}
	);

	return (
		<g>
			{
				selected
					? (
						<Segments
							id={ id }
							coordinates={ [coordinates] }
							selected={ selected }
						/>
					)
					: (
						<path
							className={ className }
							d={ coordinates.reduce(addToPath, '') }
						/>
					)
			}
		</g>
	);
});

const mapStateToProps = (state: State) => (
	{
		extent: extent(state)
	}
);

export const LineString = connect(mapStateToProps)(_LineString);
