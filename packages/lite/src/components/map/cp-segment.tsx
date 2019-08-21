import React from 'react';
import { METRIC } from 'lite/constants';
import { connect } from 'react-redux';
import { addToPath } from 'lite/utils/util-add-to-path';
import { unitSystem } from 'lite/store/selectors/index.selectors';
import { geoDistance } from 'lite/utils/util-geo';
import { mergeClasses } from 'lite/utils/util-merge-classes';
import {
	Co,
	State,
	UnitSystem } from 'se';
import {
	mToFt,
	mToDisplay,
	ftToDisplay } from 'lite/utils/util-conversion';

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
	const d = [a, b].reduce(addToPath, '');

	return (
		<g>
			{/*<path*/}
			{/*	d={ d }*/}
			{/*	id={ `${ id }-o` }*/}
			{/*	className="outline"*/}
			{/*/>*/}
			<path
				d={ d }
				id={ `${ id }-p` }
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
