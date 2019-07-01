import { FeatureCollection, Co } from '../../../../types';
import {
	POLYGON,
	LINE_STRING,
	MULTI_LINE_STRING
} from '../../../../services/constants';

export const addAtIndex = (data: FeatureCollection, [_i, _j, _k, _l]: number[], co: Co) => (
	{
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
							return j !== _j
								? m1.concat([co1])
								: type === LINE_STRING
                  ? m1.concat([co, co1])
                  : type === POLYGON || type === MULTI_LINE_STRING
	                  ? (m1 as Co[][]).concat([(co1 as Co[]).reduce((m2: Co[], c2: Co, k: number) => {
	                    return k === _k
	                      ? m2.concat([co, c2])
	                      : m2.concat([c2]);
	                  }, [])])
	                  : m1.concat([co1]);
            }, [] as Co[] | Co[][] | Co[][][])
          }
        }
    })
  }
);
