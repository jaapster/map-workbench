import { FeatureCollection } from '../../../../types';
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

const processRing = (_k: number, m1: any[], co1: any) => (
	_k == null
		? m1
		: _k === 0
			? m1.concat([co1.slice(1, co1.length - 1).concat(co1[1])])
			: m1.concat([co1.reduce(withoutIndex(_k), [])])
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
										? processRing(_k, m1, co1)
										: type === MULTI_LINE_STRING
											? _k == null
												? m1
												: m1.concat([co1.reduce(withoutIndex(_k), [])])
											: type === MULTI_POLYGON
												? _k == null
													? m1
													: m1.concat([co1.reduce((m2: any[], co2: any, k: number) => (
														_k !== k
															? m2.concat([co2])
															: processRing(_l, m2, co2)
													), [])])
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
