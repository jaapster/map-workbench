import React from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { PrimaryMapControl } from '../../misc/map-control/primary-map-control';
import {
	Co,
	EPSG,
	State } from 'se';
import { center, currentCRS, zoom } from 'lite/store/selectors/index.selectors';

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


		try {
			return {
				...m,
				[key]: JSON.parse(value)
			};
		} catch (e) {
			return {
				...m,
				[key]: value
			};
		}
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
	const c = PrimaryMapControl.projectToCRS(center, CRS);

	if (c == null) {
		return null;
	}

	const [x, y] = c;

	setHashParams({
		center: [round(x, 6), round(y, 6)],
		zoom: round(zoom, 1),
		epsg: CRS
	});

	return null;
});

const mapStateToProps = (state: State) => (
	{
		zoom: zoom(state),
		center: center(state),
		CRS: currentCRS(state)
	}
);

export const HashParams = connect(mapStateToProps)(_HashParams);
