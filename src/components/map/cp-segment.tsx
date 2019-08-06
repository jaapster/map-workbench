import React from 'react';
import { METRIC } from '../../constants';
import { connect } from 'react-redux';
import { addToPath } from './utils/util-add-to-path';
import { unitSystem } from '../../reducers/selectors/index.selectors';
import { geoDistance } from '../../map-control/utils/util-geo';
import { mergeClasses } from '../app/utils/util-merge-classes';
import {
	Co,
	State,
	UnitSystem } from '../../types';
import {
	mToFt,
	mToDisplay,
	ftToDisplay } from '../../utils/util-conversion';

interface Props {
	id: string;
	selected: boolean;
	unitSystem: UnitSystem;
	coordinates: Co[];
}

export const _Segment = React.memo(({ coordinates, selected, id, unitSystem }: Props) => {
	const className = mergeClasses(
		{
			'selected': selected
		}
	);

	const [a, b] = coordinates;

	return (
		<g>
			<path
				d={ [a, b].reduce(addToPath, '') }
				id={`${ id }-p`}
				className={ className }
				markerEnd={ selected ? 'url(#vertex)' : '' }
				markerStart={ selected ? 'url(#vertex)' : '' }
			/>
			{
				selected
					? (
						<text dy="18" >
							<textPath
								href={ `#${ id }-p` }
								startOffset="50%"
							>
								{
									unitSystem === METRIC
										? mToDisplay(geoDistance(a, b))
										: ftToDisplay(mToFt(geoDistance(a, b)))
								}
							</textPath>
						</text>
					)
					: null
			}
		</g>
	);
});

const mapStateToProps = (state: State) => (
	{
		unitSystem: unitSystem(state)
	}
);

export const Segment = connect(mapStateToProps)(_Segment);
