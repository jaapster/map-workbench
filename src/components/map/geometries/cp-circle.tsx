import React from 'react';
import { extent } from '../../../reducers/selectors/index.selectors';
import { connect } from 'react-redux';
import { Segment } from '../cp-segment';
import { addToPath } from '../../../utils/util-add-to-path';
import { mergeClasses } from '../../../utils/util-merge-classes';
import { multiPointToLines } from '../../../utils/util-geo-json';
import {
	Co,
	State } from '../../../types';

interface Props {
	id: string;
	selected: boolean;
	coordinates: Co[];
}

export const _Circle = React.memo(({ coordinates, selected, id }: Props) => {
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

const mapStateToProps = (state: State) => (
	{
		extent: extent(state)
	}
);

export const CircleSVG = connect(mapStateToProps)(_Circle);

