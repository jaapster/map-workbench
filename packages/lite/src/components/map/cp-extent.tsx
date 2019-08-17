import React from 'react';
import { Co, Feature, Polygon } from 'se';
import { SecondaryMapControl } from 'lite/misc/map-control/secondary-map-control';

interface Props {
	w: number;
	h: number;
	extent: Feature<Polygon>;
}

export const Extent = ({ w, h, extent }: Props) => (
	<svg className="cross">
		<path
			className="extent"
			d= { extent.geometry.coordinates[0]
				.slice()
				.reverse()
				.reduce((m: string, co: Co, i: number) => {
					const { x, y } = SecondaryMapControl.project(co);
					return `${ m }${ i ? 'L' : 'M' }${ x } ${ y }`;
				}, `M0 -1L${ w + 1 } -1L${ w + 1 } ${ h }L0 ${ h }L0 -1`)
			}
		/>
	</svg>
);
