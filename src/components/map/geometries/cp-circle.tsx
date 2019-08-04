import React from 'react';
import { Co, State } from '../../../types';
import { Segment } from '../cp-segment';
import { addToPath } from '../utils/util-add-to-path';
import { mergeClasses } from '../../app/utils/util-merge-classes';
import { multiPointToLines } from '../../../map-control/utils/util-geo-json';
import { center } from '../../../reducers/selectors/index.selectors';
import { connect } from 'react-redux';

interface Props {
	id: string;
	center: Co;
	selected: boolean;
	coordinates: Co[];
}

export const _Circle = React.memo(({ coordinates, selected, id, center }: Props) => {
	const className = mergeClasses(
		'circle',
		{
			selected
		}
	);

	const [outline, radius] = multiPointToLines(coordinates);

	return (
		<g>
			<path
				className={ className }
				d={ outline.reduce(addToPath, '') }
			/>
			{
				selected
					? (
						<Segment
							id={ id }
							selected={ selected }
							coordinates={ radius }
						/>
					)
					: (
						<path
							className={ className }
							d={ radius.reduce(addToPath, '') }
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

export const Circle = connect(mapStateToProps)(_Circle);

