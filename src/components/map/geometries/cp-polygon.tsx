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
	coordinates: Co[][];
}

export const _Polygon = React.memo(({ id, coordinates, selected, center }: Props) => {
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

const mapStateToProps = (state: State) => {
	return {
		center: center(state)
	};
};

export const Polygon = connect(mapStateToProps)(_Polygon);
