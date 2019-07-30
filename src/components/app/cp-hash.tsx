import React from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { MapControl } from '../../map-control/map-control';
import {
	Co,
	EPSG,
	State } from '../../types';

interface Props {
	CRS: EPSG;
	zoom: number;
	center: Co;
}

const SEPARATOR = '/';
const ASSIGN = ':';

const getHashParams = () => {
	const hash = window.location.hash.substr(2);

	if (!hash.length) {
		return {};
	}

	return hash.split(SEPARATOR).reduce((m, item) => {
		const [key, value] = item.split(ASSIGN);

		let v;

		try {
			v = JSON.parse(value);
		} catch (e) {
			v = value;
		}

		return {
			...m,
			[key]: v
		};
	}, {} as any);
};

const setHashParams = debounce((par: any) => {
	const params = {
		...getHashParams(),
		...par
	};

	window.location.hash = Object.keys(params).reduce((m, key) => {
		const f = params[key];

		const v = Array.isArray(f) || typeof f === 'boolean' || typeof f === 'number'
			? JSON.stringify(f)
			: f;


		return `${ m }${ SEPARATOR }${ key }${ ASSIGN }${ v }`;
	}, '#');
}, 100);

const round = (v: number, d: number) => {
	return Math.round(v * (10 ** d)) / (10 ** d);
};

export const _HashParams = React.memo(({ zoom, center, CRS }: Props) => {
	const [x, y] = MapControl.projectToCRS(center, CRS);

	setHashParams({
		center: [round(x, 6), round(y, 6)],
		zoom: round(zoom, 1),
		epsg: CRS
	});

	return null;
});

const mapStateToProps = (state: State) => (
	{
		zoom: state.mapControl.zoom,
		center: state.mapControl.center,
		CRS: state.mapControl.CRS
	}
);

export const HashParams = connect(mapStateToProps)(_HashParams);
