import {
	CIRCLE,
	LINE_STRING,
	MULTI_LINE_STRING,
	MULTI_POINT,
	MULTI_POLYGON,
	POINT,
	POLYGON
} from '../../../constants/constants';
import { Co, FeatureCollection } from '../../../types';
import { getBBox, getCircleBBox } from '../../../utils/util-get-bbox';

const ringMap = (co: Co, _l: number) => (co3: Co, l: number, xs: Co[]) => (
	l === _l || (_l === 0 && l === xs.length - 1)
		? co
		: co3
);

export const updateCoordinate = (data: FeatureCollection, [_i, _j, _k, _l]: number[], co: Co) => (
	{
		...data,
		features: data.features.map((feature: any, i: number) => {
			if (i !== _i) {
				return feature;
			}

			const { geometry, geometry: { type, coordinates }, properties } = feature;

			const newCoordinates = type === POINT
				? co
				: coordinates.map((co1: Co | Co[] | Co[][], j: number) => (
					j !== _j
						? co1
						: type === LINE_STRING || type === MULTI_POINT
							? co
							: type === MULTI_LINE_STRING
								? (co1 as Co[]).map((co2: Co, k: number) => (
									k === _k
										? co
										: co2
								))
								: type === POLYGON
									? (co1 as Co[]).map(ringMap(co, _k))
									: type === MULTI_POLYGON
										? (co1 as Co[][]).map((co2: Co[], k: number) => (
											k === _k
												? co2.map(ringMap(co, _l))
												: co2
										))
										: co1
				));

			return {
				...feature,
				geometry: {
					...geometry,
					coordinates: newCoordinates
				},
				bbox: properties.type === CIRCLE
					? getCircleBBox(newCoordinates)
					: getBBox(newCoordinates)
			};
		})
	}
);

export const updateCoordinates = (data: FeatureCollection, entries: [number[], Co][]) => (
	entries.reduce((m1, [index, co]) => updateCoordinate(m1, index, co), data)
);
