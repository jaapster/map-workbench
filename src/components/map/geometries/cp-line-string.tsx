import React from 'react';
import { Co, State } from '../../../types';
import { Segments } from '../cp-segments';
import { addToPath } from '../utils/util-add-to-path';
import { mergeClasses } from '../../app/utils/util-merge-classes';
import { center } from '../../../reducers/selectors/index.selectors';
import { connect } from 'react-redux';

interface Props {
	id: string;
	center: Co;
	selected: boolean;
	coordinates: Co[];
}

export const _LineString = React.memo(({ coordinates, selected, id, center }: Props) => {
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

const mapStateToProps = (state: State) => {
	return {
		center: center(state)
	};
};

export const LineString = connect(mapStateToProps)(_LineString);
