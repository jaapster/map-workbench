import {
	Co,
	Cos,
	FeatureCollection } from 'se';
import {
	CIRCLE,
	POLYGON,
	RECTANGLE,
	LINE_STRING,
	MULTI_POINT,
	MULTI_POLYGON,
	MULTI_LINE_STRING } from 'lite/constants';

const withoutIndex = (index: number) => (m: any[], e: any, i: number) => (
	i === index ? m : m.concat([e])
);

const processLine = (_i: number, m: Co[][], co: Co[], l: number) => (
	_i == null
		? m
		: co.length === 2
			? l > 1
				? m
				: m.concat([co])
			: m.concat([co.reduce(withoutIndex(_i), [])])
);

const processRing = (_i: number, m: Co[][], co: Co[], l: number) => (
	_i == null
		? m
		: co.length === 4
			? l > 1
				? m
				: m.concat([co])
			: _i === 0
				? m.concat([co.slice(1, co.length - 1).concat([co[1]])])
				: m.concat([co.reduce(withoutIndex(_i), [])])
);

const processPoly = ([_i, _j]: number[], m: Co[][][], co: Co[][], l: number) => (
	_i == null
		? m
		: _j == null
			? m
			:  co.length === 1 && co[0].length === 4
				? l > 1
					? m
					: m.concat([co])
				: m.concat([co.reduce((m2, co2, i) => (
					_i === i
						? processRing(_j, m2, co2, l)
						: m2.concat([co2])
				), [] as Co[][])])
);

export const deleteAtIndex = (data: FeatureCollection, [_i, _j, _k, _l]: number[]) => (
	_j != null
		? {
			...data,
			features: data.features.map((feature, i) => {
				const { geometry, geometry: { type, coordinates }, properties } = feature;

				return i !== _i
					? feature
					: {
						...feature,
						geometry: {
							...geometry,
							coordinates:
								[RECTANGLE, CIRCLE].includes(properties.type)
									? coordinates
									: (coordinates as any).reduce((m1: Cos, co1: Cos, j: number) => (
										j !== _j
											? (m1 as any).concat([co1 as any])
											: type === LINE_STRING
												? (coordinates as Co[]).length > 2
													? m1 as Co[]
													: (m1 as Co[]).concat([co1 as Co])
												: type === MULTI_POINT
													? (coordinates as Co[]).length > 1
														? m1 as Co[]
														: (m1 as Co[]).concat([co1 as Co])
													: type === POLYGON
														? processRing(_k, m1 as Co[][], co1 as Co[], coordinates.length)
														: type === MULTI_LINE_STRING
															? processLine(_k, m1 as Co[][], co1 as Co[], coordinates.length)
															: type === MULTI_POLYGON
																? processPoly([_k, _l], m1 as Co[][][], co1 as Co[][], coordinates.length)
																: (m1 as Co[]).concat([co1 as Co])
							), [] as Cos)
						}
					};
			})
		}
		: {
			...data,
			features: data.features.reduce(withoutIndex(_i), [])
		}
);
