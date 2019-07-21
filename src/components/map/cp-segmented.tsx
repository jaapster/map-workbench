import React from 'react';
import { Co } from '../../types';
import { PRECISION } from '../../constants';
import { addToPath } from './utils/util-add-to-path';
import { mergeClasses } from '../../utils/util-merge-classes';
import { coToLl, geoDis } from '../../map-control/utils/util-geo';

interface Props {
	id: string;
	coordinates: Co[][];
	selected: boolean;
}

const ZERO = { lng: 0, lat: 0 };

export const Segments = ({ coordinates, selected, id }: Props) => {
	const className = mergeClasses(
		{
			'selected': selected
		}
	);

	return (
		<g>
			{
				coordinates.reduce((m: any, co: Co[], k: number) => (
					co.reduce((m1: any[], co2: Co, j: number, l: Co[]) => {
						const _id = `${ id }-${ j }-${ k }`;
						const _a = l[j - 1];
						const _b = co2;
						const a = !j ? ZERO : coToLl(_a);
						const b = !j ? ZERO : coToLl(_b);

						return j === 0
							? m1
							: m1.concat(
								<g key={ _id }>
									<path
										id={`${ _id }-p`}
										className={ className }
										d={ [_a, _b].reduce(addToPath, '') }
										markerStart={ selected ? 'url(#vertex)' : '' }
										markerEnd={ selected ? 'url(#vertex)' : '' }
									/>
									{
										selected
											? (
												<text dy="13">
													<textPath
														href={ `#${ _id }-p` }
														startOffset="50%"
													>
														{
															geoDis(a, b).toFixed(PRECISION)
														}
													</textPath>
												</text>
											)
											: null
									}
								</g>
							);
					}, m)
				), [])
			})
			}
		</g>
	);
};
