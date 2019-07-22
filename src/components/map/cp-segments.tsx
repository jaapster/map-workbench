import React from 'react';
import { Co } from '../../types';
import { Segment } from './cp-segment';

interface Props {
	id: string;
	coordinates: Co[][];
	selected: boolean;
}

export const Segments = ({ coordinates, selected, id }: Props) => (
	<g>
		{
			coordinates.reduce((m1: any, co1: Co[], k: number) => (
				co1.reduce((m2: any[], co2: Co, j: number, l: Co[]) => {
					const _id = `${ id }-${ j }-${ k }`;

					return j === 0
						? m2
						: m2.concat(
							<Segment
								id={ _id }
								key={ _id }
								selected={ selected }
								coordinates={ [l[j - 1], co2] }
							/>
						);
					}, m1)
				), [])
			}
		)
	</g>
);
