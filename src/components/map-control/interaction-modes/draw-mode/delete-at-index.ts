import { FeatureCollection, Co } from '../../../../types';
import {
	POLYGON,
	LINE_STRING
} from '../../../../services/constants';

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
							coordinates: (coordinates as any).reduce((m1: any, co1: any, j: number) => {
								if (j !== _j) {
									return m1.concat([co1]);
								}

								if (type === LINE_STRING) {
									return m1;
								}

								if (type === POLYGON) {
									if (_k === 0) {
										// remove first and last coordinate and close the loop
										return m1.concat([co1.slice(1, co1.length - 1).concat(co1[1])]);
									}

									return m1.concat([co1.reduce((m2: Co[], co2: Co, k: number) => {
										if (k === _k) {
											return m2;
										}

										return m2.concat([co2]);
									}, [])]);
								}

	              				return m1.concat([co1]);
							}, [])
						}
					}
				})
			}
		: {
			...data,
			features: data.features.reduce((m1, feature, i) => {
				if (i !== _i) {
					return m1.concat([feature]);
				}

				return m1;
			}, [] as any)
		}
);
