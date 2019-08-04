import React from 'react';
import { center } from '../../reducers/selectors/index.selectors';
import { connect } from 'react-redux';
import {
	Co,
	State } from '../../types';
import { MapControl } from '../../map-control/map-control';
import { add } from '../../map-control/utils/util-point';
import { geoDistance, llToCo } from '../../map-control/utils/util-geo';

interface Props {
	center: Co;
}

const brackets = [
	[1, '1 m'],
	[2, '2 m'],
	[5, '5 m'],
	[10, '10 m'],
	[20, '20 m'],
	[50, '50 m'],
	[100, '100 m'],
	[200, '200 m'],
	[500, '500 m'],
	[1000, '1 km'],
	[2000, '2 km'],
	[5000, '5 km'],
	[10000, '10 km'],
	[20000, '20 km'],
	[50000, '50 km'],
	[100000, '100 km'],
	[200000, '200 km'],
	[500000, '500 km'],
	[1000000, '1000 km'],
	[2000000, '2000 km'],
	[5000000, '5000 km'],
	[10000000, '10000 km'],
	[20000000, '20000 km'],
	[50000000, '50000 km']
];

const getFoo = (m: number) => {
	return brackets.find(b => b[0] > m) || [0, '-'];
};

export const _Scale = React.memo(({ center }: Props) => {
	const co2 = llToCo(MapControl.unproject(add(MapControl.project(center), { x: 1, y: 0 })));
	const metersPerPixel = geoDistance(center, co2);

	const ms = metersPerPixel * 100;
	const foo = getFoo(ms);

	// @ts-ignore
	const width = foo[0] / metersPerPixel;

	return (
		<div className="scale" style={ { width }}>
			<span style={ { paddingLeft: 8 } }>
				{ foo[1] }
			</span>
		</div>
	);
});

const mapStateToProps = (state: State) => {
	return {
		center: center(state)
	};
};

export const Scale = connect(mapStateToProps)(_Scale);
