import {
	Co,
	Cos,
	FeatureCollection } from '../../types';
import {
	POLYGON,
	MULTI_POINT,
	LINE_STRING,
	MULTI_POLYGON,
	MULTI_LINE_STRING, RECTANGLE, CIRCLE
} from '../../constants';

const processRing = (index: any, co: any) => (m3: Co[], co1: Co, l: number) => (
	l === index
		? m3.concat([co, co1])
		: m3.concat([co1])
);

export const addAtIndex = (data: FeatureCollection, [_i, _j, _k, _l]: number[], co: Co) => (
	{
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
										? (m1 as Co[]).concat([co1 as Co])
										: type === LINE_STRING || type === MULTI_POINT
											? (m1 as Co[]).concat([co, co1] as Co[])
											: type === POLYGON || type === MULTI_LINE_STRING
												? (m1 as Co[][]).concat([(co1 as Co[]).reduce(processRing(_k, co), [])])
												: type === MULTI_POLYGON
													? (m1 as Co[][][]).concat([(co1 as Co[][]).reduce((m2, co2, k) => (
														_k !== k
															? m2.concat([co2])
															: m2.concat([co2.reduce(processRing(_l, co), [])])
													), [] as Co[][])])
													: (m1 as Co[]).concat([co1 as Co])
						), [] as Cos)
					}
				};
		})
	}
);
