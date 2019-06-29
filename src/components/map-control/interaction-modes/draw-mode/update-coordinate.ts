import {
	POINT,
	POLYGON,
	LINE_STRING,
	MULTI_POLYGON,
	MULTI_LINE_STRING
} from '../../../../services/constants';
import { FeatureCollection, Co } from '../../../../types';

export const updateCoordinate = (data: FeatureCollection, [_i, _j, _k, _l]: number[], co: Co) => (
	{
		...data,
		features: data.features.map((feature: any, i: number) => {
			const { geometry, geometry: { type, coordinates } } = feature;

			return i !== _i
				? feature
				: {
					...feature,
					geometry: {
						...geometry,
						coordinates: type === POINT
							? co
							: coordinates.map((co1: Co | Co[] | Co[][], j: number) => (
								j !== _j
									? co1
									: type === LINE_STRING
									? co
									: type === MULTI_LINE_STRING
										? (co1 as Co[]).map((co2: Co, k: number) => (
											k === _k
												? co
												: co2
										))
										: type === POLYGON
											? (co1 as Co[]).map((co2: Co, k: number, xs: Co[]) => (
												k === _k || (_k === 0 && k === xs.length - 1)
													? co
													: co2
											))
											: type === MULTI_POLYGON
												? (co1 as Co[][]).map((co2: Co[], k: number) => (
													k === _k
														? co2.map((co3: Co, l: number, xs: Co[]) => (
															l === _l || (_l === 0 && l === xs.length - 1)
																? co
																: co3
														))
														: co2
												))
												: co1
							))
					}
				};
		})
	}
);
