import { FeatureCollection, Co } from '../../../../types';
import {
	POLYGON,
	LINE_STRING,
	MULTI_POINT,
	MULTI_POLYGON,
	MULTI_LINE_STRING
} from '../../../../services/constants';

const withoutIndex = (index: number) => (m: any[], e: any, i: number) => (
	i === index ? m : m.concat([e])
);

const processRing = (i: number, m: Co[][], co: Co[]) => (
	i == null
		? m
		: i === 0
			? m.concat([co.slice(1, co.length - 1).concat(co[1])])
			: m.concat([co.reduce(withoutIndex(i), [])])
);

export const deleteAtIndex = (data: FeatureCollection, [_i, _j, _k, _l]: number[]) => (
	_j != null
		? {
		...data,
		features: data.features.map((feature, i) => {
			const { geometry, geometry: { type, coordinates } } = feature;

			return i !== _i
				? feature
				: {
					...feature,
					geometry: {
						...geometry,
						coordinates: (coordinates as any).reduce((m1: any[], co1: any, j: number) => (
							j !== _j
								? m1.concat([co1])
								: type === LINE_STRING || type === MULTI_POINT
									? m1
									: type === POLYGON
										? processRing(_k, m1 as Co[][], co1 as Co[])
										: type === MULTI_LINE_STRING
											? _k == null
												? m1
												: (m1 as Co[][]).concat([(co1 as Co[]).reduce(withoutIndex(_k), [])])
											: type === MULTI_POLYGON
												? _k == null
													? m1
													: (m1 as Co[][][]).concat([(co1 as Co[][]).reduce((m2, co2, k) => (
														_k !== k
															? m2.concat([co2])
															: processRing(_l, m2, co2)
													), [] as Co[][])])
												: m1.concat([co1])
						), [])
					}
				};
			})
		}
		: {
			...data,
			features: data.features.reduce(withoutIndex(_i))
		}
);
